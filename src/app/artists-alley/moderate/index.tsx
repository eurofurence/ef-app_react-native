import {ArtistsAlleyCard} from "@/components/artists-alley/ArtistsAlleyCard";
import {ArtistsAlleySection} from "@/components/artists-alley/ArtistsAlleySection";
import type {IconNames} from "@/components/generic/atoms/Icon";
import {EfSectionList} from "@/components/generic/lists/EfLists";
import {artistsAlleyAdminCollection} from "@/data/collections/artists-alley/ArtistsAlleyAdmin";
import type {EfArtistsAlley} from "@/data/types/EfArtistsAlley";
import type {EfTableRegistration, EfTableRegistrationStatus} from "@/data/types/EfTableRegistration";
import {collectBy, orderBy} from "@/util/arrays";
import {vibrateAfter} from "@/util/vibrateAfter";
import {useLiveQuery} from "@tanstack/react-db";
import { Redirect, router } from 'expo-router'
import {useMemo} from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { Header } from '@/components/generic/containers/Header'
import { artistAlleyUrl } from '@/configuration'
import { useAuthState } from '@/data/clients/auth'
import { inRole } from '@/data/clients/auth.utils'

function onPressItem(item: EfArtistsAlley | EfTableRegistration) {
  router.navigate({
    pathname: '/artists-alley/moderate/[id]',
    params: {id: item.Id},
  })
}

export default function List() {
  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'list' })
  const { user } = useAuthState()

  // Get roles for preemptive RBAC.
  const isPrivileged =
    inRole(user, 'Admin') ||
    inRole(user, 'ArtistAlleyAdmin') ||
    inRole(user, 'ArtistAlleyModerator')

  const {data: source, isLoading} = useLiveQuery(artistsAlleyAdminCollection)

  const grouping = useMemo(() => {
    const sorted = orderBy(source, a =>
      a.State === 'Pending' && 1 ||
      a.State === 'Accepted' && 2 ||
      a.State === 'Published' && 3 ||
      a.State === 'Rejected' && 4 || 5)
    return collectBy(sorted, a => a.State)
  }, [source])

  const listHeaderComponent = <View className='m-5 gap-4'>
        <Label type='h3' variant='middle'>
          {t('moderate')}
        </Label>
        <Label type='compact' variant='middle'>
          {t('moderate_intro')}
        </Label>
        <Button icon='link' onPress={() => Linking.openURL(artistAlleyUrl)}>
          {t('moderate_rules')}
        </Button>
      </View>

  if (!isPrivileged) return <Redirect href='/artists-alley' />

  return (
    <View style={StyleSheet.absoluteFill}>
      <Header>{t('moderate_header')}</Header>

      <EfSectionList<EfTableRegistrationStatus, EfTableRegistration>
        refreshing={isLoading}
        onRefresh={() => vibrateAfter(artistsAlleyAdminCollection.utils.refetch())}
        scrollEnabled={true}
        contentContainerClassName="pb-32"
        ListHeaderComponent={listHeaderComponent}
        data={grouping}
        renderSection={({item}) => {
          const title = t(item)
          const icon = ((item === 'Pending' && 'notebook-edit') ||
            (item === 'Accepted' && 'notebook-check') ||
            (item === 'Published' && 'notebook') ||
            (item === 'Rejected' && 'notebook-remove') ||
            'notebook') as IconNames
          return <ArtistsAlleySection title={title} icon={icon}/>
        }}
        renderItem={({item}) => {
          return <ArtistsAlleyCard containerStyle={styles.item} item={item} onPress={onPressItem}/>
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
