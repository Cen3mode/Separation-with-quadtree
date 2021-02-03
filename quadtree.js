class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }
}

class Area {
    constructor(x1, y1, x2, y2) {
        this.point1 = new Point(x1, y1);
        this.point2 = new Point(x2, y2);
    }

    intersects(point) {
        var top = point.y >= this.point1.y;
        var bottom = point.y < this.point2.y;
        var left = point.x >= this.point1.x;
        var right = point.x < this.point2.x;

        return (top && bottom && left && right);
    }

    overlaps(area) {
        return !(this.point1.x > area.point2.x ||
            this.point2.x < area.point1.x ||
            this.point1.y > area.point2.y ||
            this.point2.y < area.point1.y);
    }
}

class Quadtree {
    constructor(nodeCapacity = 1, boundry = new Area(0, 0, width, height)) {
        this.nodeCapacity = nodeCapacity;
        this.boundry = boundry;

        this.points = [];

        this.northWest = null;
        this.northEast = null;
        this.southWest = null;
        this.southEast = null;

        this.subdivided = false;
    }

    insert(point) {
        if (!(this.boundry.intersects(point))) {
            return false;
        }

        if (this.points.length < this.nodeCapacity && !this.subdivided) {
            this.points.push(point);
            return true;
        }

        if (!this.subdivided) {
            this.subdivide();
            this.subdivided = true;
        }

        if (this.northWest.insert(point)) {
            return true;
        }
        if (this.northEast.insert(point)) {
            return true;
        }
        if (this.southWest.insert(point)) {
            return true;
        }
        if (this.southEast.insert(point)) {
            return true;
        }

        return false;
    }

    subdivide() {
        let x1 = this.boundry.point1.x;
        let x2 = (this.boundry.point2.x - x1) / 2 + x1;
        let x3 = this.boundry.point2.x;


        let y1 = this.boundry.point1.y;
        let y2 = (this.boundry.point2.y - y1) / 2 + y1;
        let y3 = this.boundry.point2.y;

        let nw = new Area(x1, y1, x2, y2);
        let ne = new Area(x2, y1, x3, y2);
        let sw = new Area(x1, y2, x2, y3);
        let se = new Area(x2, y2, x3, y3);

        this.northWest = new Quadtree(this.nodeCapacity, nw);
        this.northEast = new Quadtree(this.nodeCapacity, ne);
        this.southWest = new Quadtree(this.nodeCapacity, sw);
        this.southEast = new Quadtree(this.nodeCapacity, se);
    }

    query(range) {
        let pointsInRange = [];

        if (!this.boundry.overlaps(range)) {
            return pointsInRange;
        }

        this.points.forEach((point, i) => {
            if (range.intersects(point)) {
                pointsInRange.push(point);
            }
        });

        if (!this.subdivided) {
            return pointsInRange;
        }



        pointsInRange = pointsInRange.concat(this.northWest.query(range));
        pointsInRange = pointsInRange.concat(this.northEast.query(range));
        pointsInRange = pointsInRange.concat(this.southWest.query(range));
        pointsInRange = pointsInRange.concat(this.southEast.query(range));

        return pointsInRange;

    }

    show() {
        //console.log(this.boundry.x1, this.boundry.y1, this.boundry.x2 - this.boundry.x1, this.boundry.y2 - this.boundry.y1);
        //rect(this.boundry.x1, this.boundry.y1, this.boundry.x2 - this.boundry.x1, this.boundry.y2 - this.boundry.y1);
        line(this.boundry.point1.x, this.boundry.point1.y, this.boundry.point2.x, this.boundry.point1.y);
        line(this.boundry.point1.x, this.boundry.point2.y, this.boundry.point2.x, this.boundry.point2.y);
        line(this.boundry.point1.x, this.boundry.point1.y, this.boundry.point1.x, this.boundry.point2.y);
        line(this.boundry.point2.x, this.boundry.point1.y, this.boundry.point2.x, this.boundry.point2.y);
        if (this.subdivided) {
            this.northEast.show();
            this.northWest.show();
            this.southEast.show();
            this.southWest.show();
        }
    }

}