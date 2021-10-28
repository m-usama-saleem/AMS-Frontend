import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, } from 'recharts';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


export const AMS_PieChart = (props) => {
    const [appointments, setappointments] = useState([]);

    useEffect(() => {
        setappointments(props.Appointments)
    });

    return (
        <ResponsiveContainer>
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    // isAnimationActive={false}
                    data={appointments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                // fill="#8884d8"
                // label
                >
                    {appointments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}