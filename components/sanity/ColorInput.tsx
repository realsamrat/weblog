import React, { useCallback } from 'react'
import { Stack, Button, Text, Card } from '@sanity/ui'
import { StringInputProps, set } from 'sanity'
import { generateRandomPastelColor, getContrastColor } from '../../lib/utils'

export function ColorInput(props: StringInputProps) {
  const { onChange, value } = props

  const handleRandomize = useCallback(() => {
    const newColor = generateRandomPastelColor()
    onChange(set(newColor))
  }, [onChange])

  return (
    <Stack space={3}>
      <Card padding={3} border style={{ backgroundColor: value || '#E5E7EB' }}>
        <Text size={1} style={{ color: value ? getContrastColor(value) : '#334155' }}>
          Preview: {value || 'No color selected'}
        </Text>
      </Card>
      {props.renderDefault(props)}
      <Button
        mode="ghost"
        tone="primary"
        text="Randomize Color"
        onClick={handleRandomize}
      />
    </Stack>
  )
}
