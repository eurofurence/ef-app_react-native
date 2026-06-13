// Patches crypto globally.
import * as expoCrypto from 'expo-crypto'

// @ts-expect-error
global.crypto = expoCrypto
