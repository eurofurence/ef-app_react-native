import { Text } from 'react-native'

// Enable native selection for all Text components by default.
// Use a safe cast to avoid TypeScript complaints about defaultProps.
;(Text as any).defaultProps = (Text as any).defaultProps || {}
;(Text as any).defaultProps.selectable = true
