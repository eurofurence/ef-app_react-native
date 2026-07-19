import type {CollectionImpl, WithoutVirtualProps} from '@tanstack/react-db'

type RecursiveWithoutVirtualProps<T> = T extends object ? WithoutVirtualProps<{
  [key in keyof T]: RecursiveWithoutVirtualProps<T[key]>
}> : T

/**
 * Infers the entity type of a collection.
 */
export type CollectionItem<T> = T extends CollectionImpl<infer U> ? RecursiveWithoutVirtualProps<U> : never

