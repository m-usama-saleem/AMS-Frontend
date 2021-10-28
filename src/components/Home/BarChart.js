import React, { useState, useEffect } from 'react';
import { Legend, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, } from 'recharts';

export const AMS_BarChart = (props) => {
    const [data, setdata] = useState([]);
    const [label1, setlabel1] = useState("");
    const [label2, setlabel2] = useState("");
    const [type, settype] = useState("");

    useEffect(() => {
        setdata(props.Data)
        setlabel1(props.Label1)
        setlabel2(props.Label2)
        settype(props.Type)
    });

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={type} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name={label1} dataKey="value1" fill="#8884d8" />
                <Bar name={label2} dataKey="value2" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    )
}