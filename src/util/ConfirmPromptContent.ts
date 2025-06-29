export type ConfirmPromptContent =
  | {
      title: string
      body: string
      confirmText: string
      cancelText: string
    }
  | {
      title: string
      body: string
      deleteText: string
      cancelText: string
    }
