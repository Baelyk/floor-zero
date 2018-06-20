/* globals StatBlock, EquipmentSet, Vector, Spellbook, HitboxCircle, HitboxMulti, BasicIntelligence, creatures */

// Entities

// Entity base class, used for anything with physical presence in combat
class Entity { // eslint-disable-line no-unused-vars
  constructor () {
    this.velocity = new Vector(0, 0); // Generally sticks to 0 except for animations (e.g. arrow flying)
  }

  addStats (stats) {
    if (this.stats) {
      this.stats.unassign();
    }
    stats.assign(this);
    return this;
  }
}

// The creature base class
class Creature extends Entity { // eslint-disable-line no-unused-vars
  constructor (x, y) {
    super();
    this.position = new Vector(0, 0);
    this.name = 'Nameless';
    this.addStats(new StatBlock(100));
    this.addHitbox(new HitboxCircle(20));
    this.addIntelligence(new BasicIntelligence());
    this.addEquipment();
    this.sprite = 'baddie.png';
    this.alignment = 'Neutral';
    this.maxActionTimer = 100;
    this.actionTimer = this.maxActionTimer;
    this.moveTarget = false;

    this.moveTo(x, y);
    creatures.push(this);
  }

  addSpellbook (spells) {
    if (this.spellbook) {
      this.spellbook.unassign();
    }
    if (spells instanceof Spellbook) {
      spells.assign(this);
    } else {
      (new Spellbook(spells)).assign(this);
    }
    return this;
  }

  addHitbox (hitbox, multi = false) {
    if (this.hitbox && !multi) {
      this.hitbox.unassign();
    } else if (!multi) {
      hitbox.assign(this);
    } else {
      new HitboxMulti([this.hitbox, hitbox]).assign(this);
    }
    return this;
  }

  addEquipment (equipment) {
    if (this.equipment) {
      this.equipment.unassign();
    }
    let equip;
    if (equipment) {
      equip = equipment;
    } else {
      equip = new EquipmentSet();
    }
    equip.assign(this);
  }

  addIntelligence (intelligence) {
    if (this.intelligence) {
      this.intelligence.unassign();
    }
    intelligence.assign(this);
  }

  moveTo () {
    if (arguments.length === 1) {
      // Only one argument is specified, an object {x: x, y: y}
      // e.g. `creature.moveTo({x: 10, y: 50})`
      this.position = arguments[0].clone();
    } else {
      // Two arguments specified, an x and a y
      // e.g. `creature.moveTo(10, 50)`
      this.position = new Vector(arguments[0], arguments[1]);
    }
    this.moveTarget = false;
    return this;
  }

  attack (target) {
    target.stats.takeDamage(this.stats.getStat('AttackDamage'));
  }

  die () {
    console.log(`Creature ${this.name} is ded 💀☠️👻`);
    let index = creatures.indexOf(this);
    if (index > -1) {
      creatures.splice(index, 1);
    }
  }

  move (target) { // Target is a Vector
    let maxMovement = this.stats.getStat('movement');
    if (this.position === target) {
      this.moveTarget = false;
    } else {
      if (this.position.to(target).magnitude() > maxMovement) {
        let moveDir = this.position.to(target).unit(maxMovement);
        this.moveTarget = this.position.add(moveDir);
      } else {
        this.moveTarget = target;
      }
    }
  }

  cancelMove () {
    this.moveTarget = false;
  }
}

// The player class
class Player extends Creature { // eslint-disable-line no-unused-vars
  constructor (x, y) {
    super(x, y);
    this.name = 'Player';
    this.sprite = 'friend.png';
    this.alignment = 'Ally';
  }
}

// The enemy class
class Enemy extends Creature { // eslint-disable-line no-unused-vars
  constructor (x, y) {
    super(x, y);
    this.name = 'Villain';
    this.alignment = 'Enemy';
  }
}
