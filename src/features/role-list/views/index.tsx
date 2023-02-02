/** @format */
import React, {useEffect} from 'react'
import {Picker} from '@tarojs/components'
import {API} from '@/src/types/index'
import {useRoleList} from '@/src/stores/role-list'

interface Props {
    children?: React.ReactNode
    onChange?: (value: API.Message.RoleList.Data) => void
}

function RoleList(props: Props) {
    const [data, onLoad] = useRoleList(state => [state.data, state.onLoad])
    useEffect(() => {
        onLoad()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Picker mode="selector" range={data} rangeKey="name" onChange={e => props?.onChange?.(data[e.detail.value])}>
            {props?.children}
        </Picker>
    )
}

export default RoleList
