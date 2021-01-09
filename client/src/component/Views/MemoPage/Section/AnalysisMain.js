import React from 'react'
import { Chart } from "react-google-charts";

function AnalysisMain(props) {

    return (
        <div style ={{ margin: '-5% 0% auto'}}>
            <Chart
                chartType="PieChart"
                data={props.memoData}
                width={"600px"}
                height={"600px"}
                legendToggle
                options={{
                    title: '카테고리 별 작성한 메모 수',
                    // Just add this option
                    is3D: true,
                  }}
            />
        </div>
    )
}

export default AnalysisMain
