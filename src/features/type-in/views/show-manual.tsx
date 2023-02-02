/** @format */
import {runComponent, CloseFunc, Result} from '@/src/utils/run-component'
import {View} from '@tarojs/components'
import {Button} from '@nutui/nutui-react-taro'
import {useState} from 'react'
import {goRoute, Pages} from '@/src/utils/routes'
import {isNull} from '@/src/utils'
import Taro from '@tarojs/taro'
import styles from './show-manual.module.scss'
import BaseItem from '../components/base-item'

interface Props {
    _onClose?: CloseFunc
}

function Manual(props: Props) {
    const [order, setOrder] = useState('')
    const [zhahao, setZhahao] = useState('')
    // const [sku, setSku] = useState('')
    const onDestroy = (res: Result<string>) => {
        if (typeof props._onClose === 'function') {
            props._onClose(res)
        }
    }

    const onClose = () => {
        onDestroy({code: -1, message: '关闭弹窗'})
    }

    const onConfirm = () => {
        if (isNull(order) || isNull(zhahao)) {
            Taro.showToast({icon: 'none', title: '请先填写订单号和扎号'})
            return
        }
        goRoute(Pages.pages_pkg_type_in_manual, {orderId: order, zhahao})
        onDestroy({code: 0, message: '', data: ''})
    }

    return (
        <View className="ba__dialog__mask">
            <View className={styles.container}>
                <View className={styles.head}>手工录菲</View>
                <View className={styles.form}>
                    <BaseItem
                        leftWidth={26}
                        label="订单号："
                        placeholder="输入订单号"
                        required
                        value={order}
                        onInput={value => setOrder(value)}
                    />
                    {/* <BaseItem leftWidth={26} label="SKU：" placeholder="非必填项" onInput={value => setSku(value)} /> */}
                    <BaseItem
                        leftWidth={26}
                        label="扎号："
                        placeholder="输入扎号"
                        required
                        value={zhahao}
                        onInput={value => setZhahao(value)}
                    />
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

export default Manual

export const showManual = () => {
    return runComponent(Manual, {})
}
