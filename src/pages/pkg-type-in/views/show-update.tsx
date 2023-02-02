/** @format */
import {runComponent, CloseFunc, Result} from '@/src/utils/run-component'
import {View, Text, Picker, CommonEventFunction, PickerSelectorProps} from '@tarojs/components'
import {Button} from '@nutui/nutui-react-taro'
import {BaseItem} from '@/src/features/type-in/index'
import Taro from '@tarojs/taro'
import {useEffect, useState} from 'react'
import {isNull} from '@/src/utils'
import {API} from '@/src/types/index'

import styles from './show-update.module.scss'
import {useEdit} from '../stores/edit'
import {adjustProcess, getAdjustUsers} from '../api'

interface Props {
    _onClose?: CloseFunc
    id: string
}

function Update(props: Props) {
    const editStore = useEdit()
    const [jpNumber, setJpNumber] = useState('')
    const [currentUser, setUser] = useState<API.TypeIn.AdjustmentToUserList.Data | null>(null)
    const [userList, setUserList] = useState<API.TypeIn.AdjustmentToUserList.Data[]>([])

    useEffect(() => {
        getAdjustUsers().then(res => {
            if (res.code === 0) {
                setUserList(res.data)
            } else {
                Taro.showToast({icon: 'none', title: res.message})
            }
        })
    }, [])

    const onDestroy = (res: Result<string>) => {
        if (typeof props._onClose === 'function') {
            props._onClose(res)
        }
    }

    const onClose = () => {
        onDestroy({code: -1, message: '关闭弹窗'})
    }

    const onConfirm = async () => {
        if (isNull(jpNumber) && !currentUser) {
            Taro.showToast({icon: 'none', title: '请先填写编号或者姓名'})
            return
        }
        const res = await adjustProcess({userProcessId: props.id, jpNumber: jpNumber || currentUser?.jp_number || ''})
        if (res.code !== 0) {
            Taro.showToast({icon: 'none', title: res.message})
            return
        }
        onDestroy({code: 0, message: '', data: ''})
    }

    const onPickerChange: CommonEventFunction<PickerSelectorProps.ChangeEventDetail> = e => {
        const index = e.detail.value
        const item = userList[index]
        if (item) {
            setUser(item)
        }
    }

    const order = editStore.data?.order
    const list = editStore.data?.userProcessList || []
    const item = list.find(i => String(i.id) === props.id)

    return (
        <View className="ba__dialog__mask">
            <View className={styles.container}>
                <View className={styles.head}>
                    <Text>工菲调整</Text>
                </View>
                <View className={styles.tips}>调整给ta</View>
                <View className={styles.form}>
                    <View className={styles.left}>
                        <View>
                            <View className={styles.leftItem}>姓名：{item?.user_name}</View>
                            <View className={styles.leftItem}>工序：{order?.process_name}</View>
                            <View className={styles.leftItem}>扎号：{item?.bar_num}</View>
                            <View className={styles.leftItem}>数量：{item?.quintity}</View>
                        </View>
                    </View>
                    <View className={styles.right}>
                        <BaseItem
                            label="编号："
                            labelStyle={styles.label}
                            placeholder="单行输入"
                            className={styles.baseItem}
                            value={jpNumber}
                            onInput={val => {
                                setJpNumber(val)
                            }}
                        />
                        <BaseItem
                            label="姓名："
                            labelStyle={styles.label}
                            placeholder="单行输入"
                            className={styles.baseItem}
                            rightReactNode={
                                <Picker mode="selector" range={userList} rangeKey="name" onChange={onPickerChange}>
                                    <Text className={styles.rightText}>{currentUser?.name || '选择'}</Text>
                                </Picker>
                            }
                        />
                    </View>
                </View>
                <View className={styles.btns}>
                    <Button type="default" shape="square" onClick={onClose} color="rgb(206, 153, 36)">
                        返回
                    </Button>
                    <Button type="default" shape="square" onClick={onConfirm} color="rgb(30, 142, 225)">
                        确认
                    </Button>
                </View>
            </View>
        </View>
    )
}

export default Update

export const showUpdate = (props: Props) => {
    return runComponent(Update, props)
}
