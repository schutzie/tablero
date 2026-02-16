import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { playerStore, PlayerRootState, PlayerAppDispatch } from '../../services/playerStore';
import {
  fetchAllPlayers,
  createPlayer,
  createPlayerWithId,
  updatePlayer,
  deletePlayer,
  selectPlayer,
} from '../../services/playerSlice';
import { uploadPlayerPhoto, deletePlayerPhoto, generatePlayerId } from '../../services/playerService';
import { Player } from '../../model/player';
import { Position } from '../../model/helpers/enums';

const POSITION_OPTIONS = Object.values(Position);
const DOMINANT_HAND_OPTIONS = ['left', 'right', 'ambidextrous'] as const;

function ManagePlayerForm() {
  const dispatch = useDispatch<PlayerAppDispatch>();
  const { items, selectedItem, loading, error } = useSelector(
    (state: PlayerRootState) => state.players
  );

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredFirstName, setPreferredFirstName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('USA');
  const [dominantHand, setDominantHand] = useState<'left' | 'right' | 'ambidextrous'>('right');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [pendingPlayerId, setPendingPlayerId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    dispatch(fetchAllPlayers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedItem) {
      setFirstName(selectedItem.firstName || '');
      setLastName(selectedItem.lastName || '');
      setPreferredFirstName(selectedItem.displayName || '');
      setJerseyNumber(selectedItem.jerseyNumber || '');
      setPositions(selectedItem.position || []);
      setHeight(selectedItem.height ? String(selectedItem.height) : '');
      setWeight(selectedItem.weight ? String(selectedItem.weight) : '');
      setDateOfBirth(selectedItem.dateOfBirth || '');
      setEmail(selectedItem.email || '');
      setPhone(selectedItem.phone || '');
      setCity(selectedItem.city || '');
      setState(selectedItem.state || '');
      setCountry(selectedItem.country || 'USA');
      setDominantHand(selectedItem.dominantHand || 'right');
      setPhotoURL(selectedItem.photoURL || null);
      setLocalPhotoUri(null);
      setIsEditing(true);
    }
  }, [selectedItem]);

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPreferredFirstName('');
    setJerseyNumber('');
    setPositions([]);
    setHeight('');
    setWeight('');
    setDateOfBirth('');
    setEmail('');
    setPhone('');
    setCity('');
    setState('');
    setCountry('USA');
    setDominantHand('right');
    setPhotoURL(null);
    setLocalPhotoUri(null);
    setPendingPlayerId(null);
    setIsEditing(false);
    dispatch(selectPlayer(null));
  };

  const togglePosition = (pos: Position) => {
    setPositions(prev =>
      prev.includes(pos)
        ? prev.filter(p => p !== pos)
        : [...prev, pos]
    );
  };

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', `Please grant ${useCamera ? 'camera' : 'photo library'} access to select a photo.`);
      return;
    }

    const launchFn = useCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await launchFn({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalPhotoUri(uri);

      // Upload immediately while the cache file still exists.
      // Waiting until form submit causes ENOENT because the OS may
      // clean the ImagePicker cache before the upload runs.
      try {
        setUploadingPhoto(true);
        let playerId: string;
        if (isEditing && selectedItem) {
          playerId = selectedItem.playerId;
        } else {
          // Pre-generate a Firestore doc ID for the new player
          const id = pendingPlayerId || generatePlayerId();
          if (!pendingPlayerId) setPendingPlayerId(id);
          playerId = id;
        }
        const downloadURL = await uploadPlayerPhoto(playerId, uri);
        setPhotoURL(downloadURL);
      } catch (err: any) {
        Alert.alert('Upload Error', err.message || 'Failed to upload photo');
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const showPhotoOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage(true);
          if (buttonIndex === 2) pickImage(false);
        }
      );
    } else {
      Alert.alert('Select Photo', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => pickImage(true) },
        { text: 'Choose from Library', onPress: () => pickImage(false) },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }
    if (!jerseyNumber.trim()) {
      Alert.alert('Error', 'Jersey number is required');
      return;
    }

    try {
      const formData: any = {
        firstName,
        lastName,
        jerseyNumber,
        position: positions,
        height: height ? Number(height) : 0,
        weight: weight ? Number(weight) : 0,
        country,
        dominantHand,
        photoURL: photoURL ?? null,
        isActive: true,
      };
      if (preferredFirstName) formData.displayName = preferredFirstName;
      if (dateOfBirth) formData.dateOfBirth = dateOfBirth;
      if (email) formData.email = email;
      if (phone) formData.phone = phone;
      if (city) formData.city = city;
      if (state) formData.state = state;

      if (isEditing && selectedItem) {
        // Photo was already uploaded in pickImage, photoURL is set
        await dispatch(updatePlayer({ id: selectedItem.playerId, data: formData })).unwrap();
        Alert.alert('Success', 'Player updated successfully');
      } else if (pendingPlayerId) {
        // Photo was picked and uploaded with a pre-generated ID
        await dispatch(createPlayerWithId({ id: pendingPlayerId, data: formData })).unwrap();
        Alert.alert('Success', 'Player created successfully');
      } else {
        // No photo was picked, create normally with auto-generated ID
        await dispatch(createPlayer(formData)).unwrap();
        Alert.alert('Success', 'Player created successfully');
      }
      resetForm();
      dispatch(fetchAllPlayers());
    } catch (err: any) {
      setUploadingPhoto(false);
      Alert.alert('Error', err.message || 'Operation failed');
    }
  };

  const handleEdit = (item: Player) => {
    dispatch(selectPlayer(item));
  };

  const handleDelete = async (player: Player) => {
    Alert.alert('Confirm Delete', `Delete ${player.firstName} ${player.lastName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Delete photo from storage if exists
            if (player.photoURL) {
              try {
                await deletePlayerPhoto(player.photoURL);
              } catch {
                // Photo may not exist in storage, continue with delete
              }
            }
            await dispatch(deletePlayer(player.playerId)).unwrap();
            Alert.alert('Success', 'Player deleted successfully');
            dispatch(fetchAllPlayers());
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Delete failed');
          }
        },
      },
    ]);
  };

  const displayPhotoUri = localPhotoUri || photoURL;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manage Players</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>
          {isEditing ? 'Edit Player' : 'Create New Player'}
        </Text>

        {/* Photo Picker */}
        <Text style={styles.label}>Photo</Text>
        <Pressable style={styles.photoPicker} onPress={showPhotoOptions}>
          {displayPhotoUri ? (
            <Image
              source={{ uri: displayPhotoUri }}
              style={styles.photoImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Tap to add photo</Text>
            </View>
          )}
        </Pressable>
        {uploadingPhoto && (
          <View style={styles.uploadingRow}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.uploadingText}>Uploading photo...</Text>
          </View>
        )}

        {/* Name Fields */}
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />

        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
        />

        <Text style={styles.label}>Preferred First Name</Text>
        <TextInput
          style={styles.input}
          value={preferredFirstName}
          onChangeText={setPreferredFirstName}
          placeholder="Preferred first name"
        />

        {/* Jersey Number */}
        <Text style={styles.label}>Jersey Number *</Text>
        <TextInput
          style={styles.input}
          value={jerseyNumber}
          onChangeText={setJerseyNumber}
          placeholder="Jersey number"
        />

        {/* Positions - Multiselect */}
        <Text style={styles.label}>Positions</Text>
        <View style={styles.chipContainer}>
          {POSITION_OPTIONS.map((pos) => (
            <Pressable
              key={pos}
              style={[
                styles.chip,
                positions.includes(pos as Position) && styles.chipSelected,
              ]}
              onPress={() => togglePosition(pos as Position)}
            >
              <Text
                style={[
                  styles.chipText,
                  positions.includes(pos as Position) && styles.chipTextSelected,
                ]}
              >
                {pos}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Physical */}
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          placeholder="Height in cm"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="Weight in kg"
          keyboardType="numeric"
        />

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
        />

        {/* Contact */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />

        {/* Location */}
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="City"
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="State"
        />

        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
          placeholder="Country"
        />

        {/* Dominant Hand */}
        <Text style={styles.label}>Dominant Hand</Text>
        <View style={styles.chipContainer}>
          {DOMINANT_HAND_OPTIONS.map((hand) => (
            <Pressable
              key={hand}
              style={[
                styles.chip,
                dominantHand === hand && styles.chipSelected,
              ]}
              onPress={() => setDominantHand(hand)}
            >
              <Text
                style={[
                  styles.chipText,
                  dominantHand === hand && styles.chipTextSelected,
                ]}
              >
                {hand.charAt(0).toUpperCase() + hand.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Submit / Cancel Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
            disabled={loading || uploadingPhoto}
          >
            {loading || uploadingPhoto ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? 'Update' : 'Create'}
              </Text>
            )}
          </Pressable>

          {isEditing && (
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={resetForm}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Player List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>All Players ({items.length})</Text>

        {loading && items.length === 0 ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>No players yet. Create one above!</Text>
        ) : (
          items.map((player) => (
            <View key={player.playerId} style={styles.itemCard}>
              <View style={styles.playerRow}>
                {player.photoURL ? (
                  <Image
                    source={{ uri: player.photoURL }}
                    style={styles.playerThumb}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.playerThumb, styles.playerThumbPlaceholder]}>
                    <Text style={styles.playerThumbInitial}>
                      {(player.firstName?.[0] || '') + (player.lastName?.[0] || '')}
                    </Text>
                  </View>
                )}
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    {player.firstName} {player.lastName}
                    {player.displayName ? ` (${player.displayName})` : ''}
                  </Text>
                  <Text style={styles.playerDetail}>
                    #{player.jerseyNumber}
                    {player.position?.length > 0 && ` | ${player.position.join(', ')}`}
                  </Text>
                  {player.dominantHand && (
                    <Text style={styles.playerDetail}>
                      Hand: {player.dominantHand}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.itemActions}>
                <Pressable
                  style={[styles.button, styles.editButton]}
                  onPress={() => handleEdit(player)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDelete(player)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default function ManagePlayer() {
  return (
    <Provider store={playerStore}>
      <ManagePlayerForm />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  // Photo picker
  photoPicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  uploadingText: {
    fontSize: 13,
    color: '#007AFF',
  },
  // Chips for multiselect
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#999',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // List
  listSection: {
    marginBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playerThumb: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  playerThumbPlaceholder: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerThumbInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  playerDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
});
