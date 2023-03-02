/** @format */
import {runComponent, CloseFunc, Result} from '@/src/utils/run-component'
import {View, Text, Picker} from '@tarojs/components'
import {Button, Icon} from '@nutui/nutui-react-taro'
import {goRoute, Pages} from '@/src/utils/routes'
import {getScanResult} from '@/src/services/wx'
import {useEffect, useState} from 'react'
import {isNull} from '@/src/utils'
import Taro from '@tarojs/taro'
import {API} from '@/src/types/index'

import styles from './show-edit.module.scss'
import BaseItem from '../components/base-item'
import {getProcessList} from '../api/index'

interface Props {
    _onClose?: CloseFunc
}
function Edit(props: Props) {
    const [orderId, setOrderId] = useState('')
    const [zhahao, setZhahao] = useState('')
    const [list, setList] = useState<API.TypeIn.GetProcessList.Data[]>([])
    const [gongxu, setGongxu] = useState('')
    useEffect(() => {
        if (orderId) {
            getProcessList({orderNum: orderId}).then(res => {
                if (res.code === 0) {
                    setList(res.data || [])
                }
            })
        } else {
            setList([])
        }
    }, [orderId])
    const onDestroy = (res: Result<string>) => {
        if (typeof props._onClose === 'function') {
            props._onClose(res)
        }
    }
    const onClose = () => {
        onDestroy({code: -1, message: '关闭弹窗'})
    }
    const onConfirm = () => {
        if (isNull(orderId)) {
            Taro.showToast({icon: 'none', title: '请先填写订单'})
            return
        }
        if (isNull(gongxu)) {
            Taro.showToast({icon: 'none', title: '请先选择工序'})
            return
        }
        goRoute(Pages.pages_pkg_type_in_edit, {orderNum: orderId, processId: gongxu, zhahao})
        onDestroy({code: 0, message: '', data: ''})
    }
    const onScan = async () => {
        const res = await getScanResult()
        if (res?.result) {
            const [id, zh] = res.result.split('-')
            if (isNull(id) || isNull(zh)) {
                Taro.showToast({icon: 'none', title: '二维码不正确'})
                return
            }
            setOrderId(id)
            setZhahao(zh)
        }
    }
    const label = list.find(i => String(i.id) === gongxu)?.process_name || '选择工序'
    return (
        <View className="ba__dialog__mask">
            <View className={styles.container}>
                <View className={styles.head}>
                    <Text>工菲修改</Text>
                    <Icon
                        className={styles.qrCode}
                        fontClassName="iconfont-v2"
                        classPrefix="icon"
                        name="saoyisao"
                        size="28px"
                        onClick={onScan}
                    />
                </View>
                <View className={styles.tips}>*员工权限只限删除自己的工菲</View>
                <View className={styles.form}>
                    <BaseItem
                        required
                        label="订单号："
                        placeholder="输入订单号"
                        value={orderId}
                        onInput={val => setOrderId(val)}
                    />
                    <BaseItem
                        required
                        label="工序："
                        placeholder="选择工序"
                        rightReactNode={
                            <Picker
                                mode="selector"
                                range={list}
                                rangeKey="process_name"
                                onChange={e => {
                                    const item = list[e.detail.value as number]
                                    if (item) {
                                        setGongxu(String(item.id))
                                    }
                                }}>
                                <Text className={styles.rightText}>{label}</Text>
                            </Picker>
                        }
                    />
                    <BaseItem label="扎号：" placeholder="输入扎号" value={zhahao} onInput={val => setZhahao(val)} />
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

export default Edit

export const showEdit = () => {
    return runComponent(Edit, {})
}
