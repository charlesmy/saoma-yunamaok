/** @format */
import React from 'react'
import {View} from '@tarojs/components'
import classNames from 'classnames'
import './simple.scss'

export interface TableItem {
    id: string
    name: string
    value: string | number
}

interface Props {
    list: TableItem[]
}

function TableList({list = [], ...rest}: Props) {
    return (
        <View className="simple-table" {...rest}>
            {list?.map(item => (
                <View className="simple-table__row" key={item.id}>
                    <View className={classNames('simple-table__column', 'simple-table__label')}>{item.name}</View>
                    <View className={classNames('simple-table__column', 'simple-table__value')}>{item.value}</View>
                </View>
            ))}
        </View>
    )
}

export default React.memo(TableList)
