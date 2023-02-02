/** @format */
import {View, Button, Input} from '@tarojs/components'
import SimpleTable, {TableItem} from '@/src/components/table/simple'
import classNames from 'classnames'
import Taro, {useRouter, useDidShow} from '@tarojs/taro'
import {useEffect, useState} from 'react'
import {TypeInManual, goRoute, Pages} from '@/src/utils/routes'
import {isNull} from '@/src/utils'
import useLockFn from '@/src/utils/hooks/useLockFn'
import {getScanResult} from '@/src/services/wx'
import {useUser} from '@/src/stores/user'

import styles from './manual.module.scss'
import Navbar from './components/navbar'
import ManualList from './views/manual-list'
import {showDesc} from './views/show-desc'
import {useManual} from './stores/manual'
import {addScan} from './api'
import {useParams} from './stores/params'

function Manual() {
    const params = useRouter().params as unknown as TypeInManual
    const [setParams, onLoad, clear, data] = useManual(state => [
        state.setParams,
        state.onLoad,
        state.clear,
        state.data,
    ])
    const user = useUser(state => state.user)
    const [num, setNum] = useState('')
    const [ids, clearIds, addId] = useParams(state => [state.ids, state.clear, state.addId])

    const gongxuids = user.bind_process_ids?.split(',') || []

    useDidShow(() => {
        Taro.setNavigationBarTitle({title: isNull(params.jp_number) ? '工菲录入' : '代人录菲'})
    })

    useEffect(() => {
        setParams({orderNum: params.orderId, zhahao: params.zhahao})
        onLoad().then(res => {
            if (res.code === 0) {
                // 设置默认选中
                const arr = res?.data?.gongxuList || []
                arr.forEach(k => {
                    const id = String(k.process_name_id || '')
                    if (gongxuids.includes(id)) {
                        addId(String(k.id || ''), true)
                        setNum(String((k.totalCount || 0) - (k.leave || 0)))
                    }
                })
            } else {
                Taro.showToast({icon: 'none', title: res.message})
            }
        })
        return () => {
            clear()
            clearIds()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const list: TableItem[] = [
        {id: '1', name: '订单号： ', value: data?.client_ordernum || ''},
        {id: '3', name: '客户： ', value: data?.client || ''},
        // {id: '2', name: 'SKU： ', value: data?.sku || ''},
        {id: '4', name: '扎号： ', value: data?.zhahao || ''},
        {id: '5', name: '颜色： ', value: data?.dress_color || ''},
        {id: '6', name: '床号： ', value: data?.chuanghao || ''},
        {id: '7', name: '尺码： ', value: data?.size_name || ''},
        {id: '8', name: '数量： ', value: data?.jianshu || ''},
    ]

    const onConfirm = useLockFn(async () => {
        if (isNull(num)) {
            Taro.showToast({icon: 'none', title: '请输入数量'})
            return
        }
        const strProcessIds = Object.keys(ids).filter(cur => !!ids[cur])
        if (strProcessIds.length <= 0) {
            Taro.showToast({icon: 'none', title: '请先选择工序'})
            return
        }

        const res = await addScan({
            orderNum: params.orderId,
            zhahao: params.zhahao,
            quintity: num,
            strProcessIds: strProcessIds.join(','),
            jpNumber: params.jp_number || '',
        })

        if (res.code === 0) {
            Taro.showToast({icon: 'none', title: '领菲成功'})
            setTimeout(() => {
                Taro.navigateBack()
            }, 1000)
        } else {
            Taro.showToast({icon: 'none', title: res.message})
        }
    })

    const onChangeSelect = count => {
        setNum(count + '')
    }

    const onScan = async () => {
        const res = await getScanResult()
        if (res && res.result) {
            const [orderId, zhahao] = res.result.split('-')
            goRoute(Pages.pages_pkg_type_in_manual, {orderId, zhahao}, 'redirectTo')
        } else {
            Taro.showToast({icon: 'none', title: '二维码不正确'})
        }
    }

    return (
        <View className={styles.page}>
            <Navbar></Navbar>
            <View>
                <SimpleTable list={list} />
                <View className={styles.sku}>SKU: {data?.sku || ''}</View>
            </View>
            <View className={styles.sum}>
                <View className={styles.count}>
                    领菲数量:
                    <Input
                        className={styles.input}
                        placeholder="输入数量"
                        type="number"
                        value={num}
                        onInput={e => setNum(e.detail.value)}
                    />
                </View>
                <Button
                    className={styles.desc}
                    onClick={() => showDesc({orderId: String(data?.id || ''), zhahao: String(data?.zhahao || '')})}>
                    领菲明细
                </Button>
            </View>
            <ManualList onChange={onChangeSelect} />
            <View className={styles.footer}>
                <Button className={classNames(styles.btn, styles.btnScan)} onClick={onScan}>
                    扫码
                </Button>
                <Button className={classNames(styles.btn, styles.btnConfirm)} onClick={onConfirm} disabled={!data}>
                    确认
                </Button>
            </View>
        </View>
    )
}

export default Manual
