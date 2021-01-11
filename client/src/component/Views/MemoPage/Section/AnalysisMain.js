import React from 'react'
import { Chart } from "react-google-charts";

function AnalysisMain(props) {

    return (
        <div>
            <Chart
                chartType="PieChart"
                data={props.memoData}
                width={"800px"}
                height={"800px"}
                legendToggle
                loader={<div style = {{margin : '10% auto'}}>
                    Loading Chart
                    </div>}
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
