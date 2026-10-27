const logServerError = (context: string, error: unknown) => {
  const metadata: Record<string, unknown> = {}

  if (error && typeof error === 'object') {
    if ('name' in error && typeof error.name === 'string') metadata.name = error.name
    if ('code' in error && typeof error.code === 'string') metadata.code = error.code
  }

  console.error(context, metadata)
}

export { logServerError }
