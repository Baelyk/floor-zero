/* globals context, Vector, restoreRenderDefaults */

// Hitbox class

class Hitbox { // eslint-disable-line no-unused-vars
  constructor (offset) {
    this.offset = offset || new Vector(0, 0);
    this.flags = {
      shouldRender: true,
      hovered: false
    };
  }

  pos () {
    return this.entity.position.add(this.offset);
  }

  assign (entity, multi = false) {
    if (!multi) {
      entity.hitbox = this;
    }
    this.entity = entity;
    if (this instanceof HitboxMulti) {
      for (let i in this.hitboxes) {
        this.hitboxes[i].assign(entity, true);
      }
    }
  }

  unassign () {
    this.entity.hitbox = undefined;
    this.entity = undefined;
  }

  // Overriden by subclasses. Checks if a point collides with the hitbox.
  isColliding (point) {
    return false; // Placeholder
  }

  // Overriden by subclasses. Visualizes the hitbox.
  render () {
    return false;
  }
}

// Circular hitbox (centered on position)
class HitboxCircle extends Hitbox { // eslint-disable-line no-unused-vars
  constructor (radius, offset) {
    super(offset);
    this.radius = radius;
  }

  isColliding (point) {
    return point.distance(this.pos()) < this.radius;
  }

  render () {
    if (!this.flags.shouldRender) {
      return; // Don't render something that shouldn't be rendered
    }
    context.beginPath();
    if (this.flags.hovered) context.strokeStyle = 'red';
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.stroke();
    restoreRenderDefaults();
  }
}

// Rectangular hitbox (centered on position)
class HitboxRect extends Hitbox { // eslint-disable-line no-unused-vars
  constructor (width, height, offset) {
    super(offset);
    this.width = width;
    this.height = height;
  }

  isColliding (point) {
    let thisX = this.pos().x;
    let thisY = this.pos().y;
    return point.x > thisX - (this.width / 2) &&
    point.x < thisX + (this.width / 2) &&
    point.y > thisY - (this.height / 2) &&
    point.y < thisY + (this.height / 2);
  }

  render () {
    if (!this.flags.shouldRender) {
      return; // Don't render something that shouldn't be rendered
    }
    context.beginPath();
    let pos = this.pos();
    context.strokeRect(pos.x - this.width / 2, pos.y - this.height / 2, this.width, this.height);
  }
}

// Hitbox consisting of multiple other hitboxes
class HitboxMulti extends Hitbox { // eslint-disable-line no-unused-vars
  constructor (hitboxes, offset) {
    super(offset);
    this.hitboxes = hitboxes || [];
  }

  isColliding (point) {
    for (let i in this.hitboxes) {
      if (this.hitboxes[i].isColliding(point)) {
        return true;
      }
    }
    return false;
  }

  render () {
    if (!this.flags.shouldRender) {
      return; // Don't render something that shouldn't be rendered
    }
    for (let i in this.hitboxes) {
      this.hitboxes[i].render();
    }
  }
}
