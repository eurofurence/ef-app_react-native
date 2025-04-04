import { useEffect, useState } from 'react'

export const useLatchTrue = (value: boolean) => {
    const [result, setResult] = useState(value)
    useEffect(() => {
        if (value) setResult(true)
    }, [value])
    return result
}
