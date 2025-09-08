mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    config: {
        basemap: {
            theme: 'monochrome',
            lightPreset: 'night'
        }
    },
    center: [-103.5917, 40.6699],
    zoom: 3
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

map.on('load', () => {
    // 使用你的campgrounds数据替换earthquake数据
    map.addSource('campgrounds', {
        type: 'geojson',
        generateId: true,
        // 将campgrounds转换为GeoJSON格式
        data: {
            type: 'FeatureCollection',
            features: campgrounds.map(camp => ({
                type: 'Feature',
                properties: {
                    id: camp._id,
                    title: camp.title,
                    location: camp.location,
                    price: camp.price,
                    description: camp.description,
                    image: camp.image && camp.image.length > 0 ? camp.image[0].url : null
                },
                geometry: camp.geometry
            }))
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });

    // 更新所有layer的source名称从'earthquakes'改为'campgrounds'
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds', // 改这里
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                10,
                '#f1f075',
                30,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                10,
                30,
                30,
                40
            ],
            'circle-emissive-strength': 1
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds', // 改这里
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds', // 改这里
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
            'circle-emissive-strength': 1
        }
    });

    // 更新点击聚合的处理
    map.addInteraction('click-clusters', {
        type: 'click',
        target: { layerId: 'clusters' },
        handler: (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('campgrounds').getClusterExpansionZoom( // 改这里
                clusterId,
                (err, zoom) => {
                    if (err) return;
                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        }
    });

    // 更新单个点的popup内容
    map.addInteraction('click-unclustered-point', {
        type: 'click',
        target: { layerId: 'unclustered-point' },
        handler: (e) => {
            const coordinates = e.feature.geometry.coordinates.slice();
            const { title, location, price, id } = e.feature.properties;

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`
                    <div>
                        <h6>${title}</h6>
                        <p><strong>Location:</strong> ${location}</p>
                        <p><strong>Price:</strong> $${price}/night</p>
                        <a href="/campgrounds/${id}" class="btn btn-primary btn-sm">View Details</a>
                    </div>
                `)
                .addTo(map);
        }
    });

    // 鼠标交互保持不变...
    map.addInteraction('clusters-mouseenter', {
        type: 'mouseenter',
        target: { layerId: 'clusters' },
        handler: () => {
            map.getCanvas().style.cursor = 'pointer';
        }
    });

    map.addInteraction('clusters-mouseleave', {
        type: 'mouseleave',
        target: { layerId: 'clusters' },
        handler: () => {
            map.getCanvas().style.cursor = '';
        }
    });

    map.addInteraction('unclustered-mouseenter', {
        type: 'mouseenter',
        target: { layerId: 'unclustered-point' },
        handler: () => {
            map.getCanvas().style.cursor = 'pointer';
        }
    });

    map.addInteraction('unclustered-mouseleave', {
        type: 'mouseleave',
        target: { layerId: 'unclustered-point' },
        handler: () => {
            map.getCanvas().style.cursor = '';
        }
    });
});