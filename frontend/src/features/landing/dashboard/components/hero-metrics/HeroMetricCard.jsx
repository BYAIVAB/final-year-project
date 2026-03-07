import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export const HeroMetricCard = ({
    title,
    value,
    icon,
    color,
    suffix = '',
    trend = 0,
    timeframe = 'vs last week'
}) => {
    // Determine trend color and icon
    const isPositive = trend >= 0;
    const trendColor = isPositive ? 'text-green-400' : 'text-red-400';
    const TrendIcon = isPositive ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
    ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
    );

    return (
        <div className="relative p-6 h-full flex flex-col justify-between overflow-hidden group border border-slate-700/50 bg-[#0A0E27]/80 backdrop-blur-sm rounded-2xl cursor-default">

            {/* Background Soft Glow */}
            <div
                className="absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: color }}
            />

            <div className="flex justify-between items-start relative z-10 mb-4">
                <p className="text-slate-400 font-medium text-sm">{title}</p>
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center border"
                    style={{
                        backgroundColor: `${color}15`, // 15% opacity hex
                        borderColor: `${color}30`,
                        color: color
                    }}
                >
                    {icon}
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white tracking-tight">
                        <CountUp
                            end={typeof value === 'number' ? value : parseFloat(value)}
                            duration={2.5}
                            decimals={value % 1 !== 0 ? 1 : 0}
                            separator=","
                        />
                    </span>
                    <span className="text-lg font-medium text-slate-400">{suffix}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <div className={`flex items-center gap-0.5 text-xs font-semibold ${trendColor}`}>
                        {TrendIcon}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                    <span className="text-xs text-slate-500">{timeframe}</span>
                </div>
            </div>
        </div>
    );
};
