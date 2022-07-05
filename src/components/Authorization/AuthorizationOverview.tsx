import {Button, StyleSheet, Text, View} from 'react-native'

import {useAppDispatch, useAppSelector} from '../../store'
import {useGetWhoAmIQuery, usePostTokenMutation} from '../../store/authorization.service'
import {logout} from '../../store/authorization.slice'

export const AuthorizationOverview = () => {
    const loggedIn = useAppSelector(state => state.authorization.isLoggedIn)
    const username = useAppSelector(state => state.authorization.username)
    const whoAmI = useGetWhoAmIQuery()

    if (whoAmI.isUninitialized) {
        return null
    }

    return (
        <View>
            {loggedIn ? (
                <Text style={{fontSize: 25, fontWeight: 'bold'}}>Welcome back {username}</Text>
            ) : (
                <Text style={{fontSize: 25, fontWeight: 'bold'}}>You are not logged in.</Text>
            )}
        </View>
    )
}
