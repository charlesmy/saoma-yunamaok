/** @format */
import {runComponent, CloseFunc, Result} from '@/src/utils/run-component'
import {View} from '@tarojs/components'
import {Button} from '@nutui/nutui-react-taro'
import {useState} from 'react'
import {goRoute, Pages} from '@/src/utils/routes'
import Taro from '@tarojs/taro'
import {getScanResult} from '@/src/services/wx'
import useLockFn from '@/src/utils/hooks/useLockFn'

import {isNull, debounce} from '@/src/utils/index'
import styles from './show-grind.module.scss'
import BaseItem from '../components/base-item'
import {helpScan} from '../api'

interface Props {
    _onClose?: CloseFunc
}

function Grind(props: Props) {
    const [jp_number, setJpNumber] = useState('')
    const [name, setName] = useState('')

    const onDestroy = (res: Result<string>) => {
        if (typeof props._onClose === 'function') {
            props._onClose(res)
        }
    }

    const onClose = () => {
        onDestroy({code: -1, message: '关闭弹窗'})
    }

    const onConfirm = useLockFn(async () => {
        if (isNull(jp_number) || isNull(name)) {
            Taro.showToast({icon: 'none', title: '请先填写工号和姓名'})
            return
        }
        const res = await getScanResult()
        if (!res) return
        /**
         * charSet: "ISO8859-1"
            errMsg: "scanCode:ok"
            rawData: "MTAyNjE2OTItMQ=="
            // 订单号-扎号
            result: "10261692-1"
            scanType: "QR_CODE"
         */
        const [orderId, zhahao] = res?.result?.split('-')
        if (isNull(orderId) || isNull(zhahao)) {
            Taro.showToast({icon: 'none', title: '二维码信息不正确'})
            return
        }
        goRoute(Pages.pages_pkg_type_in_manual, {orderId, zhahao, jp_number, name})
        onDestroy({code: 0, message: '', data: ''})
    })

    const loadUser = debounce(async (num: string) => {
        const helpRes = await helpScan({jp_number: num})
        if (helpRes.code === 0) {
            setName(helpRes.data.name)
        } else {
            Taro.showToast({icon: 'none', title: helpRes.message})
        }
    }, 50)

    const onInputJpNumber = val => {
        setJpNumber(val)
        // loadUser(val)
    }

    return (
        <View className="ba__dialog__mask">
            <View className={styles.container}>
                <View className={styles.head}>关联代扫人</View>
                <View className={styles.form}>
                    <BaseItem
                        label="代扫人工号："
                        placeholder="单行输入"
                        value={jp_number}
                        onInput={onInputJpNumber}
                        onBlur={val => loadUser(val)}
                    />
                    <BaseItem
                        label="代扫人姓名："
                        placeholder="单行输入"
                        value={name}
                        onInput={value => setName(value)}
                    />
                </View>
                <View className={styles.tips}>注：不能夸组代扫</View>
                <View className={styles.btns}>
                    <Button type="default" shape="square" onClick={onConfirm} color="rgb(30, 142, 225)">
                        确认扫码
                    </Button>
                    <Button type="default" shape="square" onClick={onClose} color="rgb(164, 173, 179)">
                        返回
                    </Button>
                </View>
            </View>
        </View>
    )
}

export default Grind

export const showGrind = () => {
    return runComponent(Grind, {})
}
