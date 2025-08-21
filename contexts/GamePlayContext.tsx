import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Circle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
}

interface GamePlayContextType {
  circles: Circle[];
  addCircle: (x: number, y: number) => void;
  updateCirclePosition: (id: number, updates: Partial<Circle>) => void;
  clearCanvas: () => void;
}

const GamePlayContext = createContext<GamePlayContextType | undefined>(undefined);

interface GamePlayProviderProps {
  children: ReactNode;
}

export const GamePlayProvider: React.FC<GamePlayProviderProps> = ({ children }) => {
  const [circles, setCircles] = useState<Circle[]>([]);

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addCircle = useCallback((x: number, y: number) => {
    const newCircle: Circle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      scale: 1,
      rotation: 0,
      color: getRandomColor(),
    };
    setCircles((prev) => [...prev, newCircle]);
  }, []);

  const updateCirclePosition = useCallback((id: number, updates: Partial<Circle>) => {
    setCircles((prev) =>
      prev.map((circle) =>
        circle.id === id ? { ...circle, ...updates } : circle
      )
    );
  }, []);

  const clearCanvas = useCallback(() => {
    setCircles([]);
  }, []);

  const value: GamePlayContextType = {
    circles,
    addCircle,
    updateCirclePosition,
    clearCanvas,
  };

  return (
    <GamePlayContext.Provider value={value}>
      {children}
    </GamePlayContext.Provider>
  );
};

export const useGamePlay = (): GamePlayContextType => {
  const context = useContext(GamePlayContext);
  if (context === undefined) {
    throw new Error('useGamePlay must be used within a GamePlayProvider');
  }
  return context;
};