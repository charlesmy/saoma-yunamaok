/** @format */
import {View, Button, RadioGroup} from '@tarojs/components'
import SimpleTable, {TableItem} from '@/src/components/table/simple'
import classNames from 'classnames'
import Taro, {useRouter} from '@tarojs/taro'
import {TypeInEdit} from '@/src/utils/routes'
import {useEffect, useState} from 'react'
import {isNull} from '@/src/utils'
import useLockFn from '@/src/utils/hooks/useLockFn'

import styles from './edit.module.scss'
import Navbar from './components/navbar'
import EditItem from './components/edit-item'
import {showUpdate} from './views/show-update'
import {useEdit, useInput} from './stores/edit'
import {delProcess, updateProcess} from './api/index'

function Edit() {
    const editStore = useEdit()
    const params = useRouter().params as unknown as TypeInEdit
    const [editId, setEditId] = useState('')
    const inputMap = useInput(state => state.map)
    const clearInput = useInput(state => state.clear)

    useEffect(() => {
        if (isNull(params.orderNum) || isNull(params.processId)) {
            Taro.showToast({icon: 'none', title: '必要参数不能为空'})
            return
        }
        editStore.setParams({orderNum: params.orderNum, processId: params.processId, zhahao: params.zhahao})
        editStore.onLoad()
        return () => {
            editStore.clear()
            clearInput()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAlertResult = (tips: string) => {
        return new Promise(resolve => {
            Taro.showModal({
                title: '提示',
                content: tips,
                success: function (res) {
                    if (res.confirm) {
                        resolve(true)
                    } else if (res.cancel) {
                        resolve(false)
                    }
                },
                fail() {
                    resolve(false)
                },
            })
        })
    }

    const onDel = useLockFn(async () => {
        const isOk = await getAlertResult('确定要删除吗？')
        if (!isOk) return
        if (isNull(editId)) {
            Taro.showToast({icon: 'none', title: '请先选择操作项目'})
            return
        }
        const res = await delProcess({userProcessIds: editId})
        if (res.code !== 0) {
            Taro.showToast({icon: 'none', title: res.message})
            return
        }
        Taro.showToast({icon: 'none', title: '删除成功'})
        setEditId('')
        editStore.onLoad()
    })

    const onEdit = useLockFn(async () => {
        const isOk = await getAlertResult('确定要修改吗？')
        if (!isOk) return
        if (isNull(editId)) {
            Taro.showToast({icon: 'none', title: '请先选择操作项目'})
            return
        }
        const count = inputMap[editId]
        if (isNull(count) || Number(count) <= 0) {
            Taro.showToast({icon: 'none', title: '请设置正确数量'})
            return
        }
        const res = await updateProcess({userProcessId: editId, jianshu: count, orderId: String(order?.id || '')})
        if (res.code !== 0) {
            Taro.showToast({icon: 'none', title: res.message})
            return
        }
        Taro.showToast({icon: 'none', title: '调整成功'})
        setEditId('')
        editStore.onLoad()
    })

    const onAdjust = async () => {
        const res = await showUpdate({id: editId})
        if (res.code === 0) {
            Taro.showToast({icon: 'none', title: '调整成功'})
            setEditId('')
            editStore.onLoad()
        }
    }

    const order = editStore.data?.order
    const processList = editStore.data?.userProcessList || []

    const list: TableItem[] = [
        {id: '1', name: '订单号： ', value: order?.client_ordernum || ''},
        // {id: '2', name: 'SKU： ', value: order?.sku || ''},
        {id: '3', name: '工序： ', value: order?.process_name || ''},
        {id: '4', name: '扎号： ', value: order?.zhahao || '-'},
    ]
    const disabled = isNull(editId)

    return (
        <View className={styles.page}>
            <Navbar />
            <View>
                <SimpleTable list={list} />
                <View className={styles.sku}>SKU: {order?.sku || ''}</View>
            </View>
            <View className={styles.list}>
                <RadioGroup
                    onChange={e => {
                        setEditId(e.detail.value)
                    }}>
                    {processList.map(item => (
                        <EditItem key={item.id} item={item} />
                    ))}
                </RadioGroup>
            </View>
            <View className={styles.footer}>
                <Button className={classNames(styles.btn, styles.btnDel)} disabled={disabled} onClick={onDel}>
                    删除
                </Button>
                <Button className={classNames(styles.btn, styles.btnScan)} onClick={onAdjust} disabled={disabled}>
                    调整
                </Button>
                <Button className={classNames(styles.btn, styles.btnConfirm)} disabled={disabled} onClick={onEdit}>
                    确认修改
                </Button>
            </View>
        </View>
    )
}

export default Edit
