/** @format */

import React, {useEffect, useMemo, useState} from 'react'
import {
    View,
    Picker,
    Text,
    Input,
    CommonEventFunction,
    PickerSelectorProps,
    PickerDateProps,
    InputProps,
} from '@tarojs/components'
import SegmentedControl from '@/src/components/segmented-control/index'
import F2Canvas from '@/src/components/f2-canvas'
import {Chart} from '@antv/f2'
import classNames from 'classnames'
import {API} from '@/src/types/index'
import {useFactoryList} from '@/src/stores/factory-list'

import styles from './salary.module.scss'
import Footer, {ChartType} from '../components/footer'
import {useSalary} from '../stores/salary'
import {getGroups} from '../api'

function Produce() {
    const factoryList = useFactoryList(state => state.data)
    const [current, setCurrent] = useState<API.Common.FactoryList.Data>({id: '', name: '全部工厂'})
    const [groupList, setGroupList] = useState<API.Common.GroupList.Data[]>([])
    const [currentGroup, setCurrentGroup] = useState<API.Common.GroupList.Data>({id: '', name: '全部组'})
    const [type, setType] = useState<ChartType>('bar')
    const [isAll, setAll] = useState(false)

    const [list, getData, setParams, params, clear] = useSalary(state => [
        state.data,
        state.getData,
        state.setParams,
        state.params,
        state.clear,
    ])

    const yearList = useMemo(() => {
        const cur = new Date()
        const now = cur.getFullYear()
        return [now - 2, now - 1, now]
    }, [])

    const segmentTabs = yearList.map(item => item + '年')
    const factorys: API.Common.FactoryList.Data[] = [{id: '', name: '全部工厂'}, ...(factoryList || [])]

    useEffect(() => {
        setParams({year: yearList[yearList.length - 1] + ''})
        getData()
        return () => {
            clear()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onInit = React.useCallback(
        async config => {
            const chart = new Chart({...config})
            // chart.coord({
            //     transposed: true,
            // })
            if (type === 'bar') {
                chart.source(list)
                chart.interval().position('x*money').adjust({
                    type: 'dodge',
                    marginRatio: 0.05,
                })
                chart.render()
            } else {
                chart.source(list)
                chart.line().position('x*money')
                chart.render()
            }
            return chart
        },
        [type, list],
    )

    const onChangeBegin: CommonEventFunction<PickerDateProps.ChangeEventDetail> = e => {
        setParams({beginTime: e.detail.value})
        getData()
    }

    const onChangeEnd: CommonEventFunction<PickerDateProps.ChangeEventDetail> = e => {
        setParams({endTime: e.detail.value})
        getData()
    }

    const onFactoryChange: CommonEventFunction<PickerSelectorProps.ChangeEventDetail> = e => {
        const cur = factorys[e.detail.value]
        if (cur) {
            setCurrent(cur)
            getGroups({factoryId: cur.id})
                .then(res => {
                    setGroupList(res.code === 0 ? res.data : [])
                })
                .finally(() => {
                    setParams({factoryId: cur.id})
                    getData()
                })
        }
    }

    const onGroupChange: CommonEventFunction<PickerSelectorProps.ChangeEventDetail> = e => {
        const cur = groupList[e.detail.value]
        if (cur) {
            setCurrentGroup(cur)
            setParams({groupId: cur.id})
            getData()
        }
    }

    const onYearChange = (index: number) => {
        setParams({year: yearList[index] + ''})
        getData()
    }

    const onInput: CommonEventFunction<InputProps.inputValueEventDetail> = e => {
        setParams({employee: e.detail.value})
        getData()
    }

    return (
        <View className={styles.item}>
            <View className={styles.filter}>
                <View className={styles.year}>
                    <SegmentedControl list={segmentTabs} current={segmentTabs.length - 1} onChange={onYearChange} />
                    <View className={styles.more} onClick={() => setAll(!isAll)}>
                        {isAll ? '收起' : '更多'}
                    </View>
                </View>
                {isAll && (
                    <View>
                        <View className={styles.custom}>
                            <Text className={styles.label}>日期</Text>
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
                        <View className={styles.factory}>
                            <Text className={styles.label}>范围</Text>
                            <Picker
                                mode="selector"
                                range={factorys}
                                rangeKey="name"
                                onChange={onFactoryChange}
                                className={styles.select}>
                                <Text className={styles.selectText}>{current?.name}</Text>
                            </Picker>
                            {current?.id && (
                                <Picker
                                    mode="selector"
                                    range={groupList}
                                    rangeKey="name"
                                    onChange={onGroupChange}
                                    className={styles.select}>
                                    <Text className={styles.selectText}>{currentGroup?.name}</Text>
                                </Picker>
                            )}
                        </View>
                        <View className={styles.factory}>
                            <Text className={styles.label}>员工</Text>
                            <Input
                                placeholder="输入员工编号/姓名"
                                className={styles.input}
                                onConfirm={onInput}
                                type="text"
                                confirmType="done"
                            />
                        </View>
                    </View>
                )}
            </View>
            {list.length > 0 && (
                <>
                    <F2Canvas id="mimo_chart_produce" onInit={onInit} style="width: 100%; height: 60vh;" />
                    <Footer onChange={t => setType(t)} />
                </>
            )}
        </View>
    )
}

export default React.memo(Produce)
