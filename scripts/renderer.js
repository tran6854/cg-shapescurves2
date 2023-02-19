class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d', {willReadFrequently: true});
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        // TODO: draw at least 2 Bezier curves
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        let curve1 = {a: {x: 200, y: 200}, b: {x: 280, y: 400}, c: {x: 580, y: 300} , d: {x: 500, y: 200}, color: [0, 0, 255, 255]};
        let curve2 = {a: {x: 80, y: 550}, b: {x: 280, y: 200}, c: {x: 580, y: 600} , d: {x: 600, y: 100}, color: [0, 200, 255, 255]};
        this.drawBezierCurve(curve1.a, curve1.b, curve1.c, curve1.d, this.num_curve_sections, curve1.color, framebuffer);
        this.drawBezierCurve(curve2.a, curve2.b, curve2.c, curve2.d, this.num_curve_sections, curve2.color, framebuffer);

        if(this.show_points){
            this.drawBezierGuide(curve1.a, curve1.b, curve1.c, curve1.d, [curve1.color[0], curve1.color[1], curve1.color[2], 130], framebuffer);
            this.drawBezierGuide(curve2.a, curve2.b, curve2.c, curve2.d, [curve2.color[0], curve2.color[1], curve2.color[2], 130], framebuffer);
        }
        // Following line is example of drawing a single line
        // (this should be removed after you implement the curve)
        // this.drawLine({x: 100, y: 100}, {x: 600, y: 300}, [255, 0, 0, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        // TODO: draw at least 2 circles
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        this.drawCircle({x: 400, y:300}, 40, this.num_curve_sections, [255, 0, 0, 255], framebuffer);
        
        this.drawCircle({x: 600, y:400}, 60, this.num_curve_sections, [0, 200, 0, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        // TODO: draw at least 2 convex polygons (each with a different number of vertices >= 5)
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        
        // Following lines are example of drawing a single triangle
        // (this should be removed after you implement the polygon)
        let point1_a = {x: 140, y: 70};
        let point1_b = {x: 380, y: 190};
        let point1_c = {x: 300, y: 390};
        let point1_d = {x: 200, y: 460};
        let point1_e = {x: 150, y: 290};
        
        let point2_a = {x: 400, y: 200};
        let point2_b = {x: 680, y: 200};
        let point2_c = {x: 580, y: 300};
        let point2_d = {x: 500, y: 400};
        let point2_e = {x: 350, y: 550};
        let point2_f = {x: 280, y: 580};
        
        this.drawConvexPolygon([point1_a, point1_b, point1_c, point1_d, point1_e], [180, 0, 180, 255], framebuffer);
        this.drawConvexPolygon([point2_a, point2_b, point2_c, point2_d, point2_e, point2_f], [0, 160, 0, 255], framebuffer);
        // this.drawTriangle(point_a, point_c, point_b, [0, 128, 128, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        // TODO: draw your name!
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        
    }

    // p0:           object {x: __, y: __}
    // p1:           object {x: __, y: __}
    // p2:           object {x: __, y: __}
    // p3:           object {x: __, y: __}
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(p0, p1, p2, p3, num_edges, color, framebuffer) {
        // TODO: draw a sequence of straight lines to approximate a Bezier curve
        //prompt on line 50
        // this.drawLine({x: 100, y: 200}, {x: 600, y: 300}, [255, 0, 0, 255], framebuffer);
        let vel = 1/num_edges;
        let t=vel;
        let ctrlP = {x: p0.x, y: p0.y}
        
        /*rainbow colored bezier just for testing
        let rainbowInc=0;
        let rainbow = [[255,0,0, 255], [255,160,0, 255], [255,230,0, 255],
                [0, 255, 0, 255], [0,0,255, 255], [200,0,255, 255]]
        //*/
        while(t<=1){
            let x = this.parametricEq(t, p0.x, p1.x, p2.x, p3.x);
            let y = this.parametricEq(t, p0.y, p1.y, p2.y, p3.y);
            let drawP = {x: x, y: y}
            // console.log("{x:"+ctrlP.x+", y: "+ctrlP.y+"}, {x:"+drawP.x+", y:"+drawP.y+"}");
            this.drawLine(ctrlP, drawP, color, framebuffer);
            if(this.show_points){
                this.drawVertex(drawP, color, framebuffer);
            }
            t+=vel;
            /*/part of rainbow colored bezier testing
            let newC = rainbowInc%6;
            rainbowInc+=1;
            this.drawLine(ctrlP, drawP, rainbow[newC], framebuffer);
            //*/
            ctrlP = drawP;
        }
    }

    parametricEq(t, p0z, p1z, p2z, p3z){
        let first = Math.pow(1-t, 3) * p0z;
        let second = 3 * Math.pow(1-t, 2) * t * p1z;
        let third =  3 * (1-t) * Math.pow(t, 2) * p2z
        let fourth = Math.pow(t, 3)*p3z;
        return Math.round(first+second+third+fourth);
    }

    drawBezierGuide(p0, p1, p2, p3, color, framebuffer){
        this.drawLine(p0, p1, color, framebuffer);
        this.drawLine(p1, p2, color, framebuffer);
        this.drawLine(p2, p3, color, framebuffer);
    }

    // center:       object {x: __, y: __}
    // radius:       int
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, num_edges, color, framebuffer) {
        // TODO: draw a sequence of straight lines to approximate a circle
        //prompt on line 70
        let ratio = 1/num_edges;
        let seg = 2*Math.PI*ratio;
        let p = seg;
        let prev = {x: center.x+radius, y: center.y};
        while(p<=2*Math.PI+seg){
            let x = Math.round(center.x + radius * Math.cos(p));
            let y = Math.round(center.y + radius * Math.sin(p));
            let drawP = {x: x, y: y};
            if(this.show_points){
                this.drawVertex(drawP, color, framebuffer);
            }
            this.drawLine(prev, drawP, color, framebuffer);
            prev = drawP;
            p+=seg;
        }
        
    }
    
    // vertex_list:  array of object [{x: __, y: __}, {x: __, y: __}, ..., {x: __, y: __}]
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawConvexPolygon(vertex_list, color, framebuffer) {
        // TODO: draw a sequence of triangles to form a convex polygon
        //prompt on line 80
        let original = {x: vertex_list[0].x, y: vertex_list[0].y};
        let draw1st = {x: vertex_list[1].x, y: vertex_list[1].y};
        let draw2nd;
        if(this.show_points){
            this.drawVertex(original, color, framebuffer);
            this.drawVertex(draw1st, color, framebuffer);
        }
        for(let i=2; i<vertex_list.length; i++){
            draw2nd = {x: vertex_list[i].x, y: vertex_list[i].y};
            // this.drawLine(prev, drawP, color, framebuffer);
            if(this.show_points){
                // this.drawVertex({x: vertex_list[i].x, y: vertex_list[i].y}, color, framebuffer);
                this.drawVertex(draw2nd, color, framebuffer);
            }
            this.drawTriangle(original, draw1st, draw2nd, color, framebuffer);
            draw1st = draw2nd;
        }
        // this.drawLine(original, drawP, color, framebuffer);
        // if(this.show_points){
        //     this.drawVertex(original, color, framebuffer);
        // }
        
    }
    
    // v:            object {x: __, y: __}
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawVertex(v, color, framebuffer) {
        // TODO: draw some symbol (e.g. small rectangle, two lines forming an X, ...) centered at position `v`
        let boxSize = 6;
        let x = v.x-boxSize*0.5;
        let y = v.y-boxSize*0.5;
        let px = this.pixelIndex(x, y, framebuffer);
        this.setFramebufferColor(framebuffer, px, [0,0,255,255]);
        for(let i=0; i<2; i++){
            this.drawLine({x: x, y: y+(i*boxSize)}, {x: x+boxSize, y: y+(i*boxSize)}, color, framebuffer);
            this.drawLine({x: x+(i*boxSize), y: y}, {x: x+(i*boxSize), y: y+boxSize}, color, framebuffer);
        }
        
    }
    
    /***************************************************************
     ***       Basic Line and Triangle Drawing Routines          ***
     ***       (code provided from in-class activities)          ***
     ***************************************************************/
    pixelIndex(x, y, framebuffer) {
	    return 4 * y * framebuffer.width + 4 * x;
    }
    
    setFramebufferColor(framebuffer, px, color) {
	    framebuffer.data[px + 0] = color[0];
	    framebuffer.data[px + 1] = color[1];
	    framebuffer.data[px + 2] = color[2];
	    framebuffer.data[px + 3] = color[3];
    }
    
    swapPoints(a, b) {
        let tmp = {x: a.x, y: a.y};
        a.x = b.x;
        a.y = b.y;
        b.x = tmp.x;
        b.y = tmp.y;
    }

    drawLine(p0, p1, color, framebuffer) {
        if (Math.abs(p1.y - p0.y) <= Math.abs(p1.x - p0.x)) { // |m| <= 1
            if (p0.x < p1.x) {
                this.drawLineLow(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineLow(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
        else {                                        // |m| > 1
            if (p0.y < p1.y) {
                this.drawLineHigh(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineHigh(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
    }

    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
        let A = y1 - y0;
        let B = x0 - x1;
        let iy = 1;
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let x = x0;
        let y = y0;
        let px;
        while (x <= x1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            x += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                y += iy;
            }
        }
    }

    drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
        let A = x1 - x0;
        let B = y0 - y1;
        let ix = 1;
        if (A < 0) {
            ix = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let x = x0;
        let y = y0;
        let px;
        while (y <= y1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            y += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                x += ix;
            }
        }
    }
    
    drawTriangle(p0, p1, p2, color, framebuffer) {
        // Sort points in ascending y order
        if (p1.y < p0.y) this.swapPoints(p0, p1);
        if (p2.y < p0.y) this.swapPoints(p0, p2);
        if (p2.y < p1.y) this.swapPoints(p1, p2);
        
        // Edge coherence triangle algorithm
        // Create initial edge table
        let edge_table = [
            {x: p0.x, inv_slope: (p1.x - p0.x) / (p1.y - p0.y)}, // edge01
            {x: p0.x, inv_slope: (p2.x - p0.x) / (p2.y - p0.y)}, // edge02
            {x: p1.x, inv_slope: (p2.x - p1.x) / (p2.y - p1.y)}  // edge12
        ];
        
        // Do cross product to determine if pt1 is to the right/left of edge02
        let v01 = {x: p1.x - p0.x, y: p1.y - p0.y};
        let v02 = {x: p2.x - p0.x, y: p2.y - p0.y};
        let p1_right = ((v01.x * v02.y) - (v01.y * v02.x)) >= 0;
        
        // Get the left and right edges from the edge table (lower half of triangle)
        let left_edge, right_edge;
        if (p1_right) {
            left_edge = edge_table[1];
            right_edge = edge_table[0];
        }
        else {
            left_edge = edge_table[0];
            right_edge = edge_table[1];
        }
        // Draw horizontal lines (lower half of triangle)
        for (let y = p0.y; y < p1.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) { 
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
        
        // Get the left and right edges from the edge table (upper half of triangle) - note only one edge changes
        if (p1_right) {
            right_edge = edge_table[2];
        }
        else {
            left_edge = edge_table[2];
        }
        // Draw horizontal lines (upper half of triangle)
        for (let y = p1.y; y < p2.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) {
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
    }
};
