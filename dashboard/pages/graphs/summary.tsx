import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next'
import React, { ReactNode } from 'react'
import { FiChevronsRight } from 'react-icons/fi'

import Layout from '../../components/common/Layout'
import SideNav from '../../components/common/sideNav'
import IUser from '../../interfaces/IUser'
import { getAzureHistoricalArticleData, getAzureHistoricalFollowerData } from '../../lib/azure'
import { getUser } from '../../lib/devto'
import IAzureHistoricalArticleData from '../../../common/interfaces/IAzureHistoricalArticleData'
import { useRouter } from 'next/router'
import Select from '../../components/common/select'
import { getPageLinks, changePage } from '../../lib/navigation'
import SummaryGraphs from '../../components/graphs/summaryGraphs'
import IAzureHistoricalFollowerData from '../../../common/interfaces/IAzureHistoricalFollowerData'

// Add .fromNow (relative times)
dayjs.extend(relativeTime)

interface IProps {
    azureHistoricalArticleData: IAzureHistoricalArticleData
    azureHistoricalFollowerData: IAzureHistoricalFollowerData
    user: IUser
}

const SummaryGraphPage = ({
    azureHistoricalArticleData,
    azureHistoricalFollowerData,
    user,
}: IProps): ReactNode => {
    const totalPosts =
        azureHistoricalArticleData.day[azureHistoricalArticleData.day.length - 1].totals.articles

    const router = useRouter()
    const pageLinks = getPageLinks(totalPosts)

    return (
        <Layout title="Analytics Dashboard" user={user}>
            <div className="px-2 lg:px-4">
                <h1 className="text-2xl md:text-3xl my-2 lg:my-4 font-bold leading-normal md:leading-normal flex items-center">
                    Dashboard
                    <FiChevronsRight className="mx-1" />
                    Graphs
                </h1>
                <Select
                    options={pageLinks}
                    className="md:hidden w-full"
                    onChange={(e) => changePage(e.target.value, pageLinks, router)}
                    selected="summary-graphs"
                />
            </div>
            <div className="grid md:grid-cols-5 md:p-4 gap-4">
                <SideNav active="summary-graphs" numArticles={totalPosts} />
                <div className="col-span-1 md:col-span-4 flex flex-col px-2 md:px-4 w-screen md:w-full">
                    <SummaryGraphs
                        azureHistoricalArticleData={azureHistoricalArticleData}
                        azureHistoricalFollowerData={azureHistoricalFollowerData}
                    />
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const promises: Promise<
        IAzureHistoricalArticleData | IAzureHistoricalFollowerData | IUser
    >[] = [getAzureHistoricalArticleData(), getAzureHistoricalFollowerData(), getUser()]

    const [azureHistoricalArticleData, azureHistoricalFollowerData, user] = await Promise.all(
        promises
    )

    return {
        props: {
            azureHistoricalArticleData,
            azureHistoricalFollowerData,
            user,
        },
        // revalidate: 60, // In seconds
    }
}

export default SummaryGraphPage
