import Chart from 'react-apexcharts';

function PieChart() {
  const ex = {
    options: {},
    series: [44, 55, 41, 17, 15],
    labels: ['A', 'B', 'C', 'D', 'E']
  };
  return (
    <div>
      <div className="donut">
        <Chart
          options={ex.options}
          series={ex.series}
          type="donut"
          width="380"
        />
      </div>
    </div>
  );
}

export default PieChart;
