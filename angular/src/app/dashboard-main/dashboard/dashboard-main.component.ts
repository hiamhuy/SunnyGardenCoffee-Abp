import { AfterViewInit, Component, Injector, OnDestroy, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ThongKeDto, ThucDonHot, ThongKeAppServicesServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
    selector: "dashboard-main",
    templateUrl: "./dashboard-main.component.html",
    styleUrls: ["./dashboard-main.component.scss"],
    animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    data: ThongKeDto = new ThongKeDto();
    thucDonHot: ThucDonHot[] = [];
    duongDanAnh: string = this.serviceImageUrl + "/";
    private root!: am5.Root;
    constructor(injector: Injector, private dataService: ThongKeAppServicesServiceProxy) {
        super(injector);
    }
    ngOnInit(): void {
        this.getInfo();
    }
    getInfo() {
        this.dataService
            .getThongKe()
            .pipe(
                finalize(() => {
                    abp.ui.clearBusy();
                })
            )
            .subscribe((result) => {
                if (result) {
                    this.data = result;
                    this.thucDonHot = result.danhSachHot;
                }
            });
    }
    ngOnDestroy(): void {
        if (this.root) {
            this.root.dispose();
        }
    }
    ngAfterViewInit(): void {
        let root = am5.Root.new("chartdiv");
        root._logo.dispose();

        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout,
            })
        );

        let legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50,
            })
        );

        let data = [
            {
                months: "01-2023",
                tienra: 2500000,
                tienvao: 2500000,
            },
            {
                months: "02-2023",
                tienra: 2600000,
                tienvao: 2700000,
            },
            {
                months: "03-2023",
                tienra: 2800000,
                tienvao: 2900000,
            },
            {
                months: "04-2023",
                tienra: 0,
                tienvao: 0,
            },
            {
                months: "05-2023",
                tienra: 2800000,
                tienvao: 2900000,
            },
            {
                months: "06-2023",
                tienra: 2800000,
                tienvao: 3000000,
            },
            {
                months: "07-2023",
                tienra: 0,
                tienvao: 0,
            },
            {
                months: "08-2023",
                tienra: 0,
                tienvao: 0,
            },
            {
                months: "09-2023",
                tienra: 0,
                tienvao: 0,
            },
            {
                months: "10-2023",
                tienra: 0,
                tienvao: 0,
            },
            {
                months: "11-2023",
                tienra: 0,
                tienvao: 0,
            },
            {
                months: "12-2023",
                tienra: 0,
                tienvao: 0,
            },
        ];

        let xRenderer = am5xy.AxisRendererX.new(root, {
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
        });

        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "months",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {}),
            })
        );

        xRenderer.grid.template.setAll({
            location: 1,
        });

        xAxis.data.setAll(data);

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1,
                }),
            })
        );

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function makeSeries(name, fieldName) {
            let series = chart.series.push(
                am5xy.ColumnSeries.new(root, {
                    name: name,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    categoryXField: "months",
                })
            );

            series.columns.template.setAll({
                tooltipText: "{name}, {categoryX}:{valueY}",
                width: am5.percent(90),
                tooltipY: 0,
                strokeOpacity: 0,
            });

            series.data.setAll(data);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationY: 0,
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
                        fill: root.interfaceColors.get("alternativeText"),
                        centerY: 0,
                        centerX: am5.p50,
                        populateText: true,
                    }),
                });
            });

            legend.data.push(series);
        }
        makeSeries("Tiền ra", "tienra");
        makeSeries("Tiền vào", "tienvao");

        chart.appear(1000, 100);
        this.root = root;
    }
}
