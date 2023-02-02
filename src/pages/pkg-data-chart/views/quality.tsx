/** @format */

import React, {useState} from 'react'
import {View, Picker, Text} from '@tarojs/components'
import SegmentedControl from '@/src/components/segmented-control/index'
import F2Canvas from '@/src/components/f2-canvas'
import {Chart} from '@antv/f2'
import styles from './produce.module.scss'
import Footer, {ChartType} from '../components/footer'

function Produce() {
    const [current, setCurrent] = useState<string | number>('全部工厂')
    const ranage = ['全部工厂', '一厂', '二厂']
    const [type, setType] = useState<ChartType>('bar')

    const data = React.useMemo(() => {
        return [
            {
                name: 'London',
                month: 'Jan.',
                rainfall: 18.9,
            },
            {
                name: 'London',
                month: 'Feb.',
                rainfall: 28.8,
            },
            {
                name: 'London',
                month: 'Mar.',
                rainfall: 39.3,
            },
            {
                name: 'London',
                month: 'Apr.',
                rainfall: 81.4,
            },
            {
                name: 'London',
                month: 'May.',
                rainfall: 47,
            },
            {
                name: 'London',
                month: 'Jun.',
                rainfall: 20.3,
            },
            {
                name: 'London',
                month: 'Jul.',
                rainfall: 24,
            },
            {
                name: 'London',
                month: 'Aug.',
                rainfall: 35.6,
            },
            {
                name: 'Berlin',
                month: 'Jan.',
                rainfall: 12.4,
            },
            {
                name: 'Berlin',
                month: 'Feb.',
                rainfall: 23.2,
            },
            {
                name: 'Berlin',
                month: 'Mar.',
                rainfall: 34.5,
            },
            {
                name: 'Berlin',
                month: 'Apr.',
                rainfall: 99.7,
            },
            {
                name: 'Berlin',
                month: 'May.',
                rainfall: 52.6,
            },
            {
                name: 'Berlin',
                month: 'Jun.',
                rainfall: 35.5,
            },
            {
                name: 'Berlin',
                month: 'Jul.',
                rainfall: 37.4,
            },
            {
                name: 'Berlin',
                month: 'Aug.',
                rainfall: 42.4,
            },
        ]
    }, [])

    const lineData = React.useMemo(() => {
        return require('../line.json')
    }, [])

    const onInit = React.useCallback(
        async config => {
            const chart = new Chart({...config})
            if (type === 'bar') {
                chart.source(data)
                chart.tooltip({
                    custom: true, // 自定义 tooltip 内容框
                })

                chart.interval().position('month*rainfall').color('name').adjust({
                    type: 'dodge',
                    marginRatio: 0.05, // 设置分组间柱子的间距
                })
                chart.render()
            } else {
                chart.source(lineData)
                chart.scale('date', {
                    type: 'timeCat',
                    tickCount: 3,
                })
                chart.scale('value', {
                    tickCount: 5,
                })
                chart.line().position('date*value').color('type')
                chart.render()
            }
            return chart
        },
        [type, data, lineData],
    )

    return (
        <View className={styles.item}>
            <View className={styles.filter}>
                <Picker
                    mode="selector"
                    range={ranage}
                    onChange={e => setCurrent(e.detail.value)}
                    className={styles.select}>
                    <Text className={styles.selectText}>{current}</Text>
                </Picker>
                <SegmentedControl list={['全部', '未开始', '生产中']} />
            </View>
            <F2Canvas id="mimo_chart_produce" onInit={onInit} style="width: 100%; height: 500rpx;" />
            <Footer onChange={t => setType(t)} />
        </View>
    )
}

export default React.memo(Produce)
