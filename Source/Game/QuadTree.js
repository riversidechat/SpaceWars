class QuadTreeItem {
    constructor(item, area, qtree, index) {
        this.item = item;
        this.area = area;
        this.qtree = qtree;
        this.index = index;
    }
}
class QuadTree {
    constructor(size = new rect(-100, -100, 100, 100), max_depth = 8, depth = 0) {
        this.depth = depth;
        this.max_depth = max_depth;
        
        this.children = new Array(4); // the four quadrents;
        this.children_area = new Array(4);
        this.items = [];
        this.parent = undefined;
        this.index = -1;

        this.resize(size);
    }

    update(item) {
        this.remove(item);
        return this.insert(item, item.area);
    }

    remove(item) {
        delete item.qtree.items[item.index];

        // item.qtree.clean();
    }
    clean() {
        if(this.hasChildren() || this.numItems() > 0)
            return;
        
        if(this.parent) {
            delete this.parent.children[this.index];
            this.parent.clean();
        } else {
            this.items = [];
        }
    }
    numItems() {
        return this.items.reduce((acc, cv) => cv? acc + 1 : acc, 0);
    }
    hasChildren() {
        return (this.children.reduce((acc, cv) => cv? acc + 1 : acc, 0) > 0)
    }

    resize(area) {
        this.clear();

		this.area = area;
		let child_size = vec2.divide(this.area.size, 2);

        this.children_area[0] = new rect(this.area.position.clone(), child_size.clone());
        this.children_area[1] = new rect(vec2.create(this.area.position.x + child_size.x, this.area.position.y), child_size.clone());
        this.children_area[2] = new rect(vec2.create(this.area.position.x, this.area.position.y + child_size.y), child_size.clone());
        this.children_area[3] = new rect(vec2.add(this.area.position, child_size), child_size.clone());
    }

    clear() {
        this.items = [];

        for (let i = 0; i < this.children.length; ++i) {
            if(!this.children[i])
                continue;

            this.children[i].clear();
        }
        this.children = new Array(4);
    }

    insert(item, item_area) {
        for(let i = 0; i < this.children.length; ++i) {
            if(!this.children_area[i].contains(item_area)) 
                continue;
            
            if(this.depth + 1 >= QuadTree.MAX_DEPTH)
                continue;

            if(!this.children[i]) {
                this.children[i] = new QuadTree(this.children_area[i], this.max_depth, this.depth + 1);
                this.children[i].parent = this;
                this.children[i].index = i;
            }

            return this.children[i].insert(item, item_area);
        }

        this.items.push(new QuadTreeItem(item, item_area, this, this.items.length));
        return this.items[this.items.length - 1];
    }

    search(area, items_found = []) {
        for(let i of this.items) {
            if(area.overlaps(i.area))
                items_found.push(i.item);
        }

        for(let i = 0; i < this.children.length; ++i) {
            if(!this.children[i])
                continue;

            if(area.contains(this.children_area[i]))
                this.children[i].getItems(items_found);
            else if(this.children_area[i].overlaps(area))
                this.children[i].search(area, items_found)
        }

        return items_found;
    }

    getItems(items_found) {
        for(let i of this.items)
            items_found.push(i.item);

        for(let i = 0; i < this.children.length; ++i)
            if(this.children[i]) this.children[i].getItems(items_found);
    }

    draw(c) {
        renderer.fillColor = color.none;
        renderer.strokeColor = ((c == undefined) ? color.white : c);
        renderer.strokeWeight = 5;
        renderer.rect(this.area);
        
        for(let item of this.items) {
            if(item)
            renderer.rect(item.area);
        }

        for(let i = 0; i < this.children.length; ++i) {
            if(!this.children[i])
                continue;

            this.children[i].draw(c);
        }
    }
}