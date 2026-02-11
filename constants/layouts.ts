import { GridLayout, Template, DesignOption } from "../types";



export const GRID_LAYOUTS: GridLayout[] = [
    // Simple 1x1 Square Layout (Moved to First Position)
    {
        id: 'grid-10',
        name: '1x1',
        shape: 'rect',
        rows: 1,
        cols: 1,
        layout: [[1]],
    },
    {
        id: 'grid-2',
        name: '1x2',
        shape: 'rect',
        rows: 1,
        cols: 2,
        layout: [[1, 2]],
    },
    {
        id: 'grid-3',
        name: '3x1',
        shape: 'rect',
        rows: 3,
        cols: 1,
        layout: [[1], [2], [3]],
    },
    {
        id: 'grid-4',
        name: 'Clover',
        shape: 'clover',
        rows: 1,
        cols: 1,
        layout: [[1]],
    },
    {
        id: 'grid-5',
        name: '2x2',
        shape: 'rect',
        rows: 2,
        cols: 2,
        layout: [
            [1, 2],
            [3, 4],
        ],
    },
    {
        id: 'grid-1',
        name: 'Heart',
        shape: 'heart',
        rows: 1,
        cols: 1,
        layout: [[1]],
    },
    {
        id: 'grid-6',
        name: 'Circles',
        shape: 'circle',
        rows: 1,
        cols: 3,
        layout: [[1, 2, 3]],
    },
    {
        id: 'grid-7',
        name: 'Hexagons',
        shape: 'hexagon',
        rows: 1,
        cols: 3,
        layout: [[1, 2, 3]],
    },
    {
        id: 'grid-8',
        name: 'Hexagon Single',
        shape: 'hexagon',
        rows: 1,
        cols: 1,
        layout: [[1]],
    },
    {
        id: 'grid-9',
        name: 'Stitch',
        shape: 'rect',
        rows: 2,
        cols: 2,
        layout: [
            [1, 2],
            [1, 2],
        ],
    },
    {
        id: 'grid-11',
        name: 'Left Heavy',
        shape: 'rect',
        rows: 2,
        cols: 2,
        layout: [
            [1, 2],
            [1, 3],
        ],
    },
    {
        id: 'grid-12',
        name: 'Right Heavy',
        shape: 'rect',
        rows: 2,
        cols: 2,
        layout: [
            [1, 2],
            [3, 2],
        ],
    },
    {
        id: 'grid-13',
        name: '3x2',
        shape: 'rect',
        rows: 3,
        cols: 2,
        layout: [
            [1, 2],
            [3, 4],
            [5, 6],
        ],
    },
    {
        id: 'grid-14',
        name: 'Top Heavy',
        shape: 'rect',
        rows: 2,
        cols: 3,
        layout: [
            [1, 1, 1],
            [2, 3, 4],
        ],
    },
    {
        id: 'grid-15',
        name: 'Bottom Heavy',
        shape: 'rect',
        rows: 2,
        cols: 3,
        layout: [
            [1, 2, 3],
            [4, 4, 4],
        ],
    },
];


export const TEMPLATES: Template[] = [
    {
        id: 'template-1',
        name: 'Spring Story 1',
        image: 'https://template.canva.com/EAE9mwvNTjs/1/0/900w-SZ6AeYnAq6o.jpg',
        placeholders: [
            { x: 50, y: 100, width: 200, height: 300 },
        ],
    },
    {
        id: 'template-2',
        name: 'Spring Story 2',
        image: 'https://template.canva.com/EAE7eXSczQE/1/0/900w-FDnvcSU917U.jpg',
        placeholders: [
            { x: 50, y: 100, width: 200, height: 300 },
        ],
    },
    {
        id: 'template-3',
        name: 'Spring Story 3',
        image: 'https://template.canva.com/EAGJNeY7vZc/2/0/900w-bYL6TrCT4tc.jpg',
        placeholders: [
            { x: 50, y: 100, width: 200, height: 300 },
        ],
    },
];

export const BIRTHDAY_TEMPLATES: Template[] = [
    {
        id: 'birthday-1',
        name: 'Birthday Card 1',
        image: 'https://template.canva.com/EAF5sJ_zElg/1/0/1135w-cDZ1WoJwkZ0.jpg',
        placeholders: [
            { x: 400, y: 600, width: 300, height: 400 }, // Estimated placeholder area
        ],
    },
    {
        id: 'birthday-2',
        name: 'Birthday Card 2',
        image: 'https://template.canva.com/EAF5sJ_zElg/1/0/1135w-cDZ1WoJwkZ0.jpg',
        placeholders: [
            { x: 400, y: 600, width: 300, height: 400 },
        ],
    },
    {
        id: 'birthday-3',
        name: 'Birthday Card 3',
        image: 'https://template.canva.com/EAF5sJ_zElg/1/0/1135w-cDZ1WoJwkZ0.jpg',
        placeholders: [
            { x: 400, y: 600, width: 300, height: 400 },
        ],
    },
    {
        id: 'birthday-4',
        name: 'Birthday Card 4',
        image: 'https://via.placeholder.com/1135x1702.png?text=Birthday+Card+4+Floral',
        placeholders: [
            { x: 400, y: 600, width: 300, height: 400 },
        ],
    },
    {
        id: 'birthday-5',
        name: 'Birthday Card 5',
        image: 'https://via.placeholder.com/1135x1702.png?text=Birthday+Card+5+Stars',
        placeholders: [
            { x: 400, y: 600, width: 300, height: 400 },
        ],
    },
    {
        id: 'birthday-6',
        name: 'Birthday Card 6',
        image: 'https://via.placeholder.com/1135x1702.png?text=Birthday+Card+6+Party',
        placeholders: [
            { x: 400, y: 600, width: 300, height: 400 },
        ],
    },
];

export const DESIGN_OPTIONS: DesignOption[] = [
    {
        id: "design-1", name: "Collage", icon: 'grid-outline'
    },
    {
        id: "design-2", name: "Design", icon: 'shapes-outline'
    },
    {
        id: "design-3", name: "Customize", icon: 'brush-outline'
    },
    {
        id: "design-4", name: "Instagram Post", icon: 'logo-instagram'
    },
    {
        id: "design-5", name: "Instagram Story", icon: 'logo-instagram'
    },
    {
        id: "design-6", name: "Logo", icon: 'ribbon-outline'
    },
    {
        id: "design-7", name: "Face Pr", icon: 'person-outline'
    }
]