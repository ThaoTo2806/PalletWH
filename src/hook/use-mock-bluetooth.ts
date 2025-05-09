"use client"

import { useState, useEffect, useCallback } from "react"
import { Alert } from "react-native"

// Định nghĩa interface cho thiết bị giả lập
export interface MockDevice {
  id: string
  name: string
  isConnectable: boolean
}

// Định nghĩa interface cho thiết bị đã kết nối
export interface ConnectedMockDevice extends MockDevice {
  disconnect: () => void
  services: () => Promise<any[]>
  characteristics: () => Promise<any[]>
  monitorCharacteristic: (callback: (value: string) => void) => () => void
}

export function useMockBluetooth() {
  const [mockDevices] = useState<MockDevice[]>([
    { id: "mock-scale-1", name: "Cân Điện Tử Ảo 1", isConnectable: true },
    { id: "mock-scale-2", name: "Cân Điện Tử Ảo 2", isConnectable: true },
    { id: "mock-scale-3", name: "Cân Điện Tử Ảo 3", isConnectable: true },
  ])

  const [scanning, setScanning] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState<ConnectedMockDevice | null>(null)
  const [weightData, setWeightData] = useState<string | null>(null)
  const [weightUpdateInterval, setWeightUpdateInterval] = useState<NodeJS.Timeout | null>(null)

  // Quét thiết bị giả lập
  const scanMockDevices = useCallback(() => {
    setScanning(true)

    // Giả lập quá trình quét
    setTimeout(() => {
      setScanning(false)
    }, 2000)

    return mockDevices
  }, [mockDevices])

  // Kết nối đến thiết bị giả lập
  const connectToMockDevice = useCallback(
    (device: MockDevice) => {
      setScanning(false)

      // Giả lập quá trình kết nối
      setTimeout(() => {
        // Tạo thiết bị đã kết nối với các phương thức cần thiết
        const connected: ConnectedMockDevice = {
          ...device,
          disconnect: () => {
            // Dừng cập nhật trọng lượng
            if (weightUpdateInterval) {
              clearInterval(weightUpdateInterval)
              setWeightUpdateInterval(null)
            }
            setConnectedDevice(null)
            setWeightData(null)
          },
          services: async () => {
            // Trả về danh sách dịch vụ giả lập
            return [{ uuid: "0000181D-0000-1000-8000-00805F9B34FB", characteristics: async () => [] }]
          },
          characteristics: async () => {
            // Trả về danh sách đặc tính giả lập
            return [
              {
                uuid: "00002A9D-0000-1000-8000-00805F9B34FB",
                isNotifiable: true,
                service: { uuid: "0000181D-0000-1000-8000-00805F9B34FB" },
              },
            ]
          },
          monitorCharacteristic: (callback) => {
            // Bắt đầu gửi dữ liệu trọng lượng giả lập
            const baseWeight = (Math.random() * 10 + 5).toFixed(2)
            setWeightData(baseWeight)
            callback(baseWeight)

            // Cập nhật trọng lượng mỗi giây với dao động nhỏ
            const interval = setInterval(() => {
              const currentWeight = Number.parseFloat(weightData || baseWeight)
              const fluctuation = (Math.random() - 0.5) * 0.1
              const newWeight = (currentWeight + fluctuation).toFixed(2)
              setWeightData(newWeight)
              callback(newWeight)
            }, 1000)

            setWeightUpdateInterval(interval)

            // Trả về hàm dọn dẹp
            return () => {
              clearInterval(interval)
              setWeightUpdateInterval(null)
            }
          },
        }

        setConnectedDevice(connected)
        Alert.alert("Kết nối thành công", `Đã kết nối với ${device.name}`)

        // Bắt đầu gửi dữ liệu trọng lượng
        const baseWeight = (Math.random() * 10 + 5).toFixed(2)
        setWeightData(baseWeight)

        // Cập nhật trọng lượng mỗi giây với dao động nhỏ
        const interval = setInterval(() => {
          const currentWeight = Number.parseFloat(weightData || baseWeight)
          const fluctuation = (Math.random() - 0.5) * 0.1
          const newWeight = (currentWeight + fluctuation).toFixed(2)
          setWeightData(newWeight)
        }, 1000)

        setWeightUpdateInterval(interval)
      }, 1500)
    },
    [weightData, weightUpdateInterval],
  )

  // Ngắt kết nối thiết bị giả lập
  const disconnectMockDevice = useCallback(() => {
    if (connectedDevice) {
      connectedDevice.disconnect()
      Alert.alert("Đã ngắt kết nối", "Thiết bị đã được ngắt kết nối")
    }
  }, [connectedDevice])

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      if (weightUpdateInterval) {
        clearInterval(weightUpdateInterval)
      }
    }
  }, [weightUpdateInterval])

  return {
    mockDevices,
    scanning,
    connectedDevice,
    weightData,
    scanMockDevices,
    connectToMockDevice,
    disconnectMockDevice,
  }
}
