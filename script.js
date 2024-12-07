class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
    this.nodePositions = [];
  }

  height(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

    return y;
  }

  insert(node, value) {
    if (!node) return new TreeNode(value);

    if (value < node.value) node.left = this.insert(node.left, value);
    else if (value > node.value) node.right = this.insert(node.right, value);
    else return node; // Duplicates not allowed

    node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;

    const balance = this.getBalance(node);

    if (balance > 1 && value < node.left.value) return this.rotateRight(node);

    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);

    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  delete(node, value) {
    if (!node) return node;

    if (value < node.value) {
      node.left = this.delete(node.left, value);
    } else if (value > node.value) {
      node.right = this.delete(node.right, value);
    } else {
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        const minNode = this.getMinValueNode(node.right);
        node.value = minNode.value;
        node.right = this.delete(node.right, minNode.value);
      }
    }

    if (!node) return node;

    node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;

    const balance = this.getBalance(node);

    if (balance > 1 && this.getBalance(node.left) >= 0) return this.rotateRight(node);

    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && this.getBalance(node.right) <= 0) return this.rotateLeft(node);

    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  getMinValueNode(node) {
    while (node.left) node = node.left;
    return node;
  }

  add(value) {
    this.root = this.insert(this.root, value);
  }

  remove(value) {
    this.root = this.delete(this.root, value);
  }

  visualize(node, container, level = 0, x = 500, y = 50, spacing = 200) {
    if (!node) return;

    node.x = x;
    node.y = y;

    const div = document.createElement("div");
    div.className = "node";
    div.innerText = node.value;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    container.appendChild(div);

    if (node.left) {
      this.visualize(node.left, container, level + 1, x - spacing / 2, y + 100, spacing / 2);
      this.nodePositions.push({ x1: x, y1: y, x2: node.left.x, y2: node.left.y });
    }

    if (node.right) {
      this.visualize(node.right, container, level + 1, x + spacing / 2, y + 100, spacing / 2);
      this.nodePositions.push({ x1: x, y1: y, x2: node.right.x, y2: node.right.y });
    }
  }

  drawEdges() {
    const svg = document.getElementById("svgCanvas");
    svg.innerHTML = ""; // Clear previous edges

    this.nodePositions.forEach((line) => {
      const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
      lineElement.setAttribute("x1", line.x1 + 25); // Adjust for node center
      lineElement.setAttribute("y1", line.y1 + 25);
      lineElement.setAttribute("x2", line.x2 + 25);
      lineElement.setAttribute("y2", line.y2 + 25);
      lineElement.setAttribute("stroke", "#4caf50");
      lineElement.setAttribute("stroke-width", "2");
      svg.appendChild(lineElement);
    });
  }
}

const tree = new AVLTree();

function addNode() {
  const value = parseInt(document.getElementById("nodeValue").value);
  if (isNaN(value)) return alert("Please enter a valid number.");

  tree.add(value);
  renderTree();
}

function deleteNode() {
  const value = parseInt(document.getElementById("nodeValue").value);
  if (isNaN(value)) return alert("Please enter a valid number.");

  tree.remove(value);
  renderTree();
}

function renderTree() {
  const container = document.getElementById("treeContainer");
  container.innerHTML = ""; // Clear previous tree
  tree.nodePositions = [];
  tree.visualize(tree.root, container);
  tree.drawEdges();
}
