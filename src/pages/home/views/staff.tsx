/** @format */
import React from 'react'
import {View, Image, Text} from '@tarojs/components'
import {Icon} from '@nutui/nutui-react-taro'
import classNames from 'classnames'
import F2Canvas from '@/src/components/f2-canvas'
import {Chart} from '@antv/f2'
import {useUser} from '@/src/stores/user'
import {formatNum} from '@/src/utils/num'
import dayjs from 'dayjs'
import {useEmployeeInfo} from '../stores/employee-info'
import styles from './staff.module.scss'

function StaffBoard() {
    const user = useUser(state => state.user)
    const employeeInfo = useEmployeeInfo(state => state.data)

    // 强转类型，适配组建样式属性
    const salaryStyle = {
        background:
            'url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%221%22%20x1%3D%220%22%20x2%3D%221%22%20y1%3D%220%22%20y2%3D%220%22%20gradientTransform%3D%22matrix(6.123233995736766e-17%2C%201%2C%20-0.27120724979090094%2C%206.123233995736766e-17%2C%200.5%2C%200)%22%3E%3Cstop%20stop-color%3D%22%23579dd5%22%20stop-opacity%3D%221%22%20offset%3D%220.57%22%3E%3C%2Fstop%3E%3Cstop%20stop-color%3D%22%231e8282%22%20stop-opacity%3D%220%22%20offset%3D%221%22%3E%3C%2Fstop%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%231)%22%3E%3C%2Frect%3E%3C%2Fsvg%3E");',
    } as unknown as string
    const stat = employeeInfo?.stat

    return (
        <View className={styles.salary} style={salaryStyle}>
            <View className={styles.info}>
                <View className={styles.infoLeft}>
                    <View className={styles.moneyLabel}>本月总工资（元）</View>
                    <View className={styles.moneyValue}>
                        <Icon
                            fontClassName={classNames('iconfont-v2', styles.moneyIcon)}
                            classPrefix="icon"
                            name="renminbi"
                            size="26px"
                        />
                        {formatNum(stat?.month_salary || 0)}
                    </View>
                </View>
                <View className={styles.infoRight}>
                    <Image src={user.headimgurl} className={styles.avatar} mode="aspectFit" />
                    <View className={styles.username}>{user.name}</View>
                    <View className={styles.userrole}>{user.role}</View>
                </View>
            </View>
            <View className={styles.list}>
                <View className={styles.listItem}>
                    <Text className={styles.listItemLabel}>本月订单量</Text>
                    <Text className={styles.listItemValue}>{stat?.month_order_count || 0}</Text>
                </View>
                <View className={styles.listItem}>
                    <Text className={styles.listItemLabel}>本月总件数</Text>
                    <Text className={styles.listItemValue}>{stat?.month_jianshu || 0}</Text>
                </View>
                <View className={styles.listItem}>
                    <Text className={styles.listItemLabel}>今日工资（元）</Text>
                    <Text className={styles.listItemValue}>{formatNum(stat?.today_salary || 0)}</Text>
                </View>
            </View>
        </View>
    )
}

interface ChartData {
    x: string
    type: string
    value: string | number
}
function StarffChart() {
    const chartData = useEmployeeInfo(state => state.data?.echartList || [])
    const lineData = React.useMemo(() => {
        // const d = require('./line.json')
        return chartData.reduce<ChartData[]>((pre, cur) => {
            pre.push({x: cur.x, type: '工资', value: cur.total_price})
            pre.push({x: cur.x, type: '数量', value: cur.total_jianshu})
            return pre
        }, [])
    }, [chartData])

    const onInit = React.useCallback(
        async config => {
            const chart = new Chart({...config})
            chart.source(lineData)
            chart.scale({
                x: {
                    type: 'timeCat',
                    tickCount: 3,
                },
                value: {
                    tickCount: 5,
                },
            })
            chart.axis('x', {
                label: function label(text, index, total) {
                    const cfg = {
                        textAlign: 'center',
                        text: dayjs(text).format('MM-DD'),
                    }
                    if (index === 0) {
                        cfg.textAlign = 'start'
                    }
                    if (index > 0 && index === total - 1) {
                        cfg.textAlign = 'end'
                    }
                    return cfg
                },
            })
            chart.line().position('x*value').color('type')
            chart.render()
            return chart
        },
        [lineData],
    )
    return (
        <View className={styles.salaryChart}>
            <F2Canvas id="mimo_chart_salary" onInit={onInit} style="width: 100%; height: 100%;" />
        </View>
    )
}

function Staff() {
    return (
        <View className={styles.staff}>
            <StaffBoard />
            <StarffChart />
        </View>
    )
}

export default React.memo(Staff)
