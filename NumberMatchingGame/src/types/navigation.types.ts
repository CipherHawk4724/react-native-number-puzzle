// src/types/navigation.types.ts
export type RootStackParamList = {
  Home: undefined;
  LevelSelect: undefined;
  GameScreen: { level: number };
  Settings: undefined;
  Statistics: undefined;
};

export interface GameScreenProps {
  route: {
    params: {
      level: number;
    };
  };
  navigation: any;
}

export interface HomeScreenProps {
  navigation: any;
}

export interface LevelSelectScreenProps {
  navigation: any;
}