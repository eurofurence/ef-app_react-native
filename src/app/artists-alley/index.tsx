import {ArtistsAlleyCard} from "@/components/artists-alley/ArtistsAlleyCard";
import {ArtistsAlleySection} from "@/components/artists-alley/ArtistsAlleySection";
import type {IconNames} from "@/components/generic/atoms/Icon";
import {EfSectionList} from "@/components/generic/lists/EfLists";
import {artistsAlleyCollection} from "@/data/collections/artists-alley/ArtistsAlley";
import {artistsAlleyAdminCollection} from "@/data/collections/artists-alley/ArtistsAlleyAdmin";
import {artistsAlleyFullCollection, type EfArtistsAlleyFull} from "@/data/collections/artists-alley/ArtistsAlleyFull";
import type {EfArtistsAlley} from "@/data/types/EfArtistsAlley";
import type {EfTableRegistration, EfTableRegistrationStatus} from "@/data/types/EfTableRegistration";
import {collectBy, orderBy} from "@/util/arrays";
import { captureException } from '@sentry/react-native'
import {useLiveQuery} from "@tanstack/react-db";
import { router } from 'expo-router'
import {useEffect, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Button } from '@/components/generic/containers/Button'
import { Header } from '@/components/generic/containers/Header'
import { artistAlleyUrl } from '@/configuration'
import { auth, useAuthState } from '@/data/clients/auth'
import { inRole } from '@/data/clients/auth.utils'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { vibrateAfter } from '@/util/vibrateAfter'

function onPressItem(item: EfArtistsAlley | EfTableRegistration) {
  router.navigate({
    pathname: '/artists-alley/[id]',
    params: {id: item.Id},
  })
}

export default function List() {
  const { t } = useTranslation('ArtistsAlley')
  const { user } = useAuthState()
  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  // Get roles for preemptive RBAC.
  const isLoggedIn = Boolean(user)
  const isAttending = inRole(user, 'Attendee')
  const isCheckedIn = inRole(user, 'AttendeeCheckedIn')
  const isPrivileged =
    inRole(user, 'Admin') ||
    inRole(user, 'ArtistAlleyAdmin') ||
    inRole(user, 'ArtistAlleyModerator')
  const isAuthorized = isCheckedIn || isPrivileged


  const {data: sourceGeneral, isLoading: isLoadingGeneral} = useLiveQuery(artistsAlleyFullCollection)
  const {data: sourceAdmin, isLoading: isLoadingAdmin} = useLiveQuery(artistsAlleyAdminCollection)

  const grouping = useMemo(() => {
    if (isPrivileged) {
      const sorted = orderBy(sourceAdmin, a =>
        a.State === 'Pending' && 1 ||
        a.State === 'Accepted' && 2 ||
        a.State === 'Published' && 3 ||
        a.State === 'Rejected' && 4 || 5)
      return collectBy(sorted, a => a.State)
    } else {
      return sourceGeneral
    }
  }, [sourceAdmin, sourceGeneral])
  const isLoading = isPrivileged ? isLoadingAdmin : isLoadingGeneral
  const refresh = isPrivileged ? artistsAlleyAdminCollection.utils.refetch : artistsAlleyCollection.utils.refetch


  useEffect(() => {
    if (isAuthorized) {
      setAnnouncementMessage(t('accessibility.artists_alley_list_loaded'))
    } else {
      setAnnouncementMessage(t('accessibility.artists_alley_unauthorized'))
    }
  }, [isAuthorized, t])

  const listHeaderComponent = <View className='m-5 gap-4'>
        <Label type='para'>{t('intro')}</Label>
        <Button
          icon='link'
          outline
          onPress={() => Linking.openURL(artistAlleyUrl)}
          accessibilityRole='button'
          accessibilityLabel={t('accessibility.learn_more_button')}
          accessibilityHint={t('accessibility.learn_more_button_hint')}
        >
          {t('learn_more')}
        </Button>

        {!isCheckedIn ? null : (
          <Button
            icon='application-edit-outline'
            onPress={() => router.navigate('/artists-alley/reg')}
            accessibilityRole='button'
            accessibilityLabel={t('accessibility.register_self_button')}
            accessibilityHint={t('accessibility.register_self_button_hint')}
          >
            {t('list.register_self')}
          </Button>
        )}
        {!isPrivileged ? null : (
          <Button
            icon='shield-plus-outline'
            onPress={() => router.navigate('/artists-alley/moderate')}
            accessibilityRole='button'
            accessibilityLabel={t('accessibility.moderate_button')}
            accessibilityHint={t('accessibility.moderate_button_hint')}
          >
            {t('list.moderate')}
          </Button>
        )}
      </View>

  const listEmptyComponent = <Label type='h3' className='mx-5' variant='middle'>
        {t('list.artists_alley_empty')}
      </Label>

  if (!isAuthorized) {
    const disabledReason =
      // Needs to be logged in.
      (!isLoggedIn && t('unauthorized_not_logged_in')) ||
      // Must be attending.
      (!isAttending && t('unauthorized_not_attending')) ||
      // Must be checked in.
      (!isCheckedIn && t('unauthorized_not_checked_in'))

    return (
      <>
        <StatusMessage message={announcementMessage} />
        <View style={StyleSheet.absoluteFill}>
          <Header>{t('list.header')}</Header>
          <View
            className='m-5 pb-24'
            ref={mainContentRef}
            accessibilityLabel={t(
              'accessibility.artists_alley_unauthorized_content'
            )}
            accessibilityRole='text'
          >
            <Label type='para' className='mb-5'>
              {t('intro')}
            </Label>
            <Button
              icon='link'
              onPress={() => Linking.openURL(artistAlleyUrl)}
              accessibilityRole='button'
              accessibilityLabel={t('accessibility.learn_more_button')}
              accessibilityHint={t('accessibility.learn_more_button_hint')}
            >
              {t('learn_more')}
            </Button>
            <Label type='compact' className='my-5'>
              {t('explanation_unauthorized')}

              {disabledReason && (
                <Label color='important' variant='bold'>
                  {` ${disabledReason}`}
                </Label>
              )}
            </Label>
            {isLoggedIn ? null : (
              <Button
                iconRight='login'
                onPress={() => auth.login().catch(captureException)}
                accessibilityRole='button'
                accessibilityLabel={t('accessibility.login_button')}
                accessibilityHint={t('accessibility.login_button_hint')}
              >
                {t('login_now')}
              </Button>
            )}
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <View style={StyleSheet.absoluteFill}>
        <Header>{t('list.header')}</Header>
        <EfSectionList<EfTableRegistrationStatus, EfArtistsAlleyFull | EfTableRegistration>
          refreshing={isLoading}
          onRefresh={() => vibrateAfter(refresh())}
          scrollEnabled={true}
          contentContainerClassName="pb-32"
          ListHeaderComponent={listHeaderComponent}
          ListEmptyComponent={listEmptyComponent}
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
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
  },
})
