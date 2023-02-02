/** @format */

import React, {useMemo, useState} from 'react'
import {View, Text, Button, Picker, Input, CommonEventFunction, InputProps, PickerDateProps} from '@tarojs/components'
import classNames from 'classnames'
import dayjs from 'dayjs'

import styles from './filter.module.scss'
import {useList} from '../stores/list'

interface TabItem {
    text: string
    // 1: 今日 2:昨日 3: 上月 4: 自定义
    index: number
    start?: string
    end?: string
}

function getTime(t: number) {
    const timestep = Date.now()
    const fmt = 'YYYY-MM-DD HH:mm:ss'
    if (t === 1) {
        return {
            start: dayjs(timestep).startOf('D').format(fmt),
            end: dayjs(timestep).endOf('D').format(fmt),
        }
    }
    if (t === 2) {
        const current = dayjs(timestep).startOf('day').subtract(1, 'day')
        return {start: current.format(fmt), end: current.endOf('day').format(fmt)}
    }
    if (t === 3) {
        const last = dayjs(timestep).startOf('month').subtract(1, 'month')
        return {start: last.startOf('month').format(fmt), end: last.endOf('month').format(fmt)}
    }
}

function Filter() {
    const [setParams, params, onPullDown] = useList(state => [state.setParams, state.params, state.onPullDown])
    const [current, setCurrent] = useState<number>(0)
    const tabs: TabItem[] = useMemo(() => {
        const d1 = getTime(1)
        const d2 = getTime(2)
        const d3 = getTime(3)
        return [
            {text: '昨日', index: 2, start: d2?.start, end: d2?.end},
            {text: '今日', index: 1, start: d1?.start, end: d1?.end},
            {text: '上月', index: 3, start: d3?.start, end: d3?.end},
        ]
    }, [])
    const [showAll, setShowAll] = useState(false)

    const onInput: CommonEventFunction<InputProps.inputEventDetail> = e => {
        setParams({jpNumberOrName: e.detail.value})
        onPullDown()
    }

    const onChangeTab = (index: number) => {
        if (current === index) {
            setParams({beginTime: '', endTime: ''})
            setCurrent(0)
            onPullDown()
            return
        }
        const d = getTime(index)
        setParams({beginTime: d?.start, endTime: d?.end})
        setCurrent(index)
        onPullDown()
    }

    const onSetBegin: CommonEventFunction<PickerDateProps.ChangeEventDetail> = e => {
        setParams({beginTime: e.detail.value})
        onPullDown()
    }

    const onSetEnd: CommonEventFunction<PickerDateProps.ChangeEventDetail> = e => {
        setParams({endTime: e.detail.value})
        onPullDown()
    }

    return (
        <View className={styles.filter}>
            <View className={styles.nav}>
                <Text className={styles.navTip}>快速筛选: </Text>
                <View className={styles.tab}>
                    {tabs.map(item => {
                        const isActive = item.start === params.beginTime && item.end === params.endTime
                        return (
                            <Text
                                key={item.index}
                                className={classNames(styles.tabItem, isActive ? styles.active : '')}
                                onClick={() => onChangeTab(item.index)}>
                                {item.text}
                            </Text>
                        )
                    })}
                </View>
                <Button className={styles.more} onClick={() => setShowAll(!showAll)}>
                    {showAll ? '收起' : '更多'}
                </Button>
            </View>
            <View className={classNames(styles.moreItem, showAll ? styles.showAll : '')}>
                <View className={styles.customDate}>
                    <Text className={classNames(styles.navTip, styles.dateTip)}>自定义日期: </Text>
                    <Picker mode="date" value={params.beginTime} onChange={onSetBegin}>
                        <Text className={classNames(styles.tabItem, styles.selectDate)}>
                            {params.beginTime ? dayjs(params.beginTime).format('YYYY-MM-DD') : '选择开始日期'}
                        </Text>
                    </Picker>
                    <Text className={styles.line}>-</Text>
                    <Picker mode="date" value={params.endTime} onChange={onSetEnd}>
                        <Text className={classNames(styles.tabItem, styles.selectDate)}>
                            {params.endTime ? dayjs(params.endTime).format('YYYY-MM-DD') : '选择结束日期'}
                        </Text>
                    </Picker>
                </View>
                <View className={styles.customFiled}>
                    <Text className={classNames(styles.navTip, styles.dateTip)}>过滤条件: </Text>
                    <Input placeholder="输入员工编号/员工姓名查询" className={styles.inputFiled} onInput={onInput} />
                </View>
            </View>
        </View>
    )
}

export default React.memo(Filter)
