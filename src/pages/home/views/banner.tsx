/** @format */

import React from 'react'
import {Swiper, SwiperItem, Image} from '@tarojs/components'
import styles from './banner.module.scss'
import {useBanner} from '../stores/banner'

function UserInfo() {
    const data = useBanner(state => state.data)
    if (!data?.lunbotu?.length) return null
    return (
        <Swiper indicatorDots autoplay>
            {data.lunbotu.map(item => (
                <SwiperItem key={item.img}>
                    <Image src={item.img} mode="aspectFill" className={styles.icon} />
                </SwiperItem>
            ))}
        </Swiper>
    )
}

export default React.memo(UserInfo)
