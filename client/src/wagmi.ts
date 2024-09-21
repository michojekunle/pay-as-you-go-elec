import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  sepolia,
  lisk,
  liskSepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '6182781540ebbc64154071bf4e7b4518',
  chains: [
    sepolia,
    lisk,
    liskSepolia,
  ],
  ssr: true,
});