/** @format */
import {View, Button, Input, Text} from '@tarojs/components'
import SimpleTable, {TableItem} from '@/src/components/table/simple'
import {CellGroup, Cell, Switch, Empty} from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import Taro, {useRouter} from '@tarojs/taro'
import {useState, useReducer, useMemo} from 'react'
// import {goRoute, Pages} from '@/src/utils/routes'
import {isNull} from '@/src/utils'
import useLockFn from '@/src/utils/hooks/useLockFn'
import {useMount} from '@/src/utils/hooks/use-mount'
// import {useUser} from '@/src/stores/user'
import {API} from '@/src/types/index'

import styles from './batch.module.scss'
import Navbar from './components/navbar'
import {getBatchScanDetail, postBatchScanAdd} from './api'
import {showFilter} from './views/show-filter'

interface State {
    data: API.TypeIn.BatchScanDetail.Data | null
}

interface ActionDone {
    type: 'done'
    data: API.TypeIn.BatchScanDetail.Data | null
}

interface ActionClear {
    type: 'clear'
}

type Actions = ActionDone | ActionClear

function batchReducer(state: State, action: Actions) {
    switch (action.type) {
        case 'done':
            return {...state, data: action.data}
        case 'clear':
            return {data: null}
        default:
            return {data: null}
    }
}

function Batch() {
    const params = useRouter().params as unknown as API.TypeIn.BatchScanDetail.Params
    const [result, dispatch] = useReducer(batchReducer, {data: null})
    const [num, setNum] = useState('')
    const [filterSize, setFilterSize] = useState<string[]>([])
    const [selectIds, setSelectIds] = useState<number[]>([])

    const data = result.data

    const gongxuList = useMemo(() => {
        const arr = data?.gongxuList || []
        if (filterSize && filterSize.length > 0) {
            return arr.filter(item => filterSize.includes(item.size_name))
        }
        return arr
    }, [data, filterSize])

    const isSelectedAll = gongxuList.length > 0 && gongxuList.length === selectIds.length

    useMount(async () => {
        const res = await getBatchScanDetail(params)
        dispatch({type: 'done', data: res.data || null})
        if (res.code !== 0) {
            Taro.showToast({icon: 'none', title: res.message})
        }
    })

    const list: TableItem[] = [
        {id: '1', name: '订单号： ', value: data?.client_ordernum || ''},
        {id: '3', name: '工序： ', value: data?.process_name || ''},
        // {id: '2', name: 'SKU： ', value: data?.sku || ''},
        {id: '4', name: '扎号： ', value: data?.zhahao || ''},
        // {id: '5', name: '颜色： ', value: data?.dress_color || ''},
        // {id: '6', name: '床号： ', value: data?.chuanghao || ''},
        // {id: '7', name: '尺码： ', value: data?.size_name || ''},
        // {id: '8', name: '数量： ', value: data?.jianshu || ''},
    ]

    const onConfirm = useLockFn(async () => {
        if (isNull(num)) {
            Taro.showToast({icon: 'none', title: '请输入数量'})
            return
        }
        if (selectIds.length <= 0) {
            Taro.showToast({icon: 'none', title: '请选择扎号'})
            return
        }
        if (!data) return
        const query = gongxuList
            .filter(current => selectIds.includes(current.zhahao))
            .map(item => ({
                zhahao: item.zhahao,
                quintity: item.totalCount - item.leave,
            }))
        const res = await postBatchScanAdd({
            orderNum: params.orderNum,
            processId: params.processId,
            params: query,
        })
        if (res.code === 0) {
            Taro.showToast({icon: 'none', title: '批量领菲成功'})
            setTimeout(() => {
                Taro.navigateBack()
            }, 1000)
        } else {
            Taro.showToast({icon: 'none', title: res.message})
        }
    })

    const onSelectAll = async () => {
        const cur = gongxuList.map(item => item.zhahao)
        if (selectIds.length > 0 && cur.length === selectIds.length) {
            setSelectIds([])
            setNum('')
        } else {
            setSelectIds(cur)
            const count = gongxuList.reduce((pre, current) => {
                pre += current.totalCount - current.leave
                return pre
            }, 0)
            setNum(String(count))
        }
    }

    const onFilter = async () => {
        const res = await showFilter({sizeList: data?.sizeList || []})
        if (res.code === 0) {
            setFilterSize(res.data)
        }
    }

    const onSwitchChange = (item: API.TypeIn.BatchScanDetail.GongxuList, bool: boolean) => {
        if (bool) {
            setSelectIds([...selectIds, item.zhahao])
            setNum(String(Number(num) + (item.totalCount - item.leave)))
        } else {
            const cur = selectIds.filter(id => id !== item.zhahao)
            setSelectIds(cur)
            setNum(String(Number(num) - (item.totalCount - item.leave)))
        }
    }

    if (!data) {
        return (
            <View className={styles.page}>
                <Empty description="暂无数据"></Empty>
            </View>
        )
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
                    <Text>领菲汇总数:</Text>
                    <Input
                        className={styles.input}
                        type="number"
                        value={num}
                        onInput={e => setNum(e.detail.value)}
                        disabled
                    />
                </View>
                <View className={styles.desc} onClick={onFilter}>
                    筛选
                </View>
            </View>
            <View className={styles.list}>
                <CellGroup>
                    {gongxuList.map(item => {
                        return (
                            <Cell
                                key={item.zhahao}
                                iconSlot={
                                    <View className={styles.flag}>
                                        <Text>{item.zhahao}.扎</Text>
                                        <Text className={styles.size}>{item.size_name}</Text>
                                        <Text className={styles.listCount}>
                                            【{item.leave}/{item.totalCount}】
                                        </Text>
                                    </View>
                                }
                                linkSlot={
                                    <Switch
                                        checked={selectIds.includes(item.zhahao)}
                                        change={(val: boolean) => onSwitchChange(item, val)}
                                    />
                                }
                            />
                        )
                    })}
                </CellGroup>
            </View>

            <View className={styles.footer}>
                <Button className={classNames(styles.btn, styles.btnScan)} onClick={onSelectAll}>
                    {isSelectedAll ? '取消全选' : '全选'}
                </Button>
                <Button className={classNames(styles.btn, styles.btnConfirm)} onClick={onConfirm} disabled={!data}>
                    确认
                </Button>
            </View>
            {/* <ShowFilter sizeList={data?.sizeList || []} /> */}
        </View>
    )
}

export default Batch
