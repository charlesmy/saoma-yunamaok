/** @format */

import React from 'react'
import {View, Picker, Text, CommonEventFunction, PickerSelectorProps} from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import {useFactoryList} from '@/src/stores/factory-list'
import styles from './filter.module.scss'
import {useList} from '../stores/list'

const StatusList = ['全部', '未开始', '车缝中', '车缝完成', '后整中', '后整完成']
const TimeList = ['完成时间', '下单时间', '裁床时间']

function Filter() {
    const params = useList(state => state.params)
    const setParams = useList(state => state.setParams)
    const reload = useList(state => state.onPullDown)
    const factorylist = useFactoryList(state => state.data)

    const onSelectFactory: CommonEventFunction<PickerSelectorProps.ChangeEventDetail> = e => {
        const item = factorylist[Number(e.detail.value)]
        if (item) {
            setParams({factoryId: String(item.id)})
            reload()
        }
    }

    const onSlectTime = async () => {
        function getAction() {
            return new Promise<number>(resolve => {
                Taro.showActionSheet({
                    itemList: TimeList,
                    success(result) {
                        resolve(result.tapIndex)
                    },
                    fail() {
                        resolve(0)
                    },
                })
            })
        }
        const index = await getAction()
        if (index === 0) return
        // 1完成时间，2下单时间，3裁床时间
        setParams({timeType: String(index + 1)})
        reload()
    }

    const onChangeBegin = e => {
        const obj = {beginTime: e.detail.value}
        if (!params.timeType) {
            obj['timeType'] = 1
        }
        setParams(obj)
        reload()
    }

    const onChangeEnd = e => {
        const obj = {endTime: e.detail.value}
        if (!params.timeType) {
            obj['timeType'] = 1
        }
        setParams(obj)
        reload()
    }

    const onSelectStatus: CommonEventFunction<PickerSelectorProps.ChangeEventDetail> = e => {
        const i = e.detail.value || 0
        setParams({status: String(Number(i) - 1)})
        reload()
    }

    const factoryName = factorylist.find(item => String(item.id) === String(params.factoryId))?.name || '选择'
    /// 状态,0未开始，1车缝生产中，2车缝完成，3后整生产中，4后整完成
    const statusIndex = Number(params.status || -1)
    const statusName = StatusList[statusIndex === -1 ? 0 : statusIndex + 1]

    return (
        <View className={styles.item}>
            <View className={styles.oneLine}>
                <Text className={styles.label}>厂区选择：</Text>
                <View className={classNames(styles.select, styles.mgr12)}>
                    <Picker range={factorylist} mode="selector" rangeKey="name" onChange={onSelectFactory}>
                        {factoryName}
                    </Picker>
                </View>
                <View className={styles.label}>状态选择：</View>
                <View className={classNames(styles.select, styles.mgr12)}>
                    <Picker range={StatusList} mode="selector" onChange={onSelectStatus}>
                        {statusName}
                    </Picker>
                </View>
            </View>
            <View className={classNames(styles.oneLine, styles.mgt12)}>
                <View className={classNames(styles.select, styles.mgr12)} onClick={onSlectTime}>
                    {TimeList[Number(params.timeType || 1) - 1]}
                </View>
                <Picker mode="date" value={params.beginTime} onChange={onChangeBegin}>
                    <Text className={classNames(styles.tabItem, styles.selectDate)}>
                        {params.beginTime || '选择开始日期'}
                    </Text>
                </Picker>
                <Text className={styles.line}>-</Text>
                <Picker mode="date" value={params.endTime} onChange={onChangeEnd}>
                    <Text className={classNames(styles.tabItem, styles.selectDate)}>
                        {params.endTime || '选择结束日期'}
                    </Text>
                </Picker>
            </View>
        </View>
    )
}

export default React.memo(Filter)
