
enum Direction {
    BEFORE,
    AFTER,
    INSIDE_AT_END,
    INSIDE_AT_START,
}

export interface FlatTreeNode {
    id: string;
    level: number;
    hasParent: boolean;
    childrenCount: number;
}

export default class MultiRootTree {

    rootIds: Array<string>;
    nodes: { [id: string]: Array<string> };

    constructor(rootIds: Array<string> = [], nodes: { [id: string]: Array<string> } = {}) {
      this.rootIds = rootIds;
      this.nodes = nodes;

      this.initRootIds();
      this.initNodes();
    }

    initRootIds(): void {
      for (const rootId of this.rootIds) {
        this.createEmptyNodeIfNotExist(rootId);
      }
    }

    initNodes(): void {
      for (const nodeKey in this.nodes) {
        if (this.nodes.hasOwnProperty(nodeKey)) {
          for (const nodeListItem of this.nodes[nodeKey]) {
            this.createEmptyNodeIfNotExist(nodeListItem);
          }
        }
      }
    }

    createEmptyNodeIfNotExist(nodeKey: string): void {
      if (!this.nodes[nodeKey]) {
        this.nodes[nodeKey] = [];
      }
    }


    getRootIds(): string[]{
      const clone = this.rootIds.slice();
      return clone;
    }

    getNodes(): {[id: string]: string[]} {
      const clone: { [id: string]: Array<string> } = {};
      for (const nodeKey in this.nodes) {
        if (this.nodes.hasOwnProperty(nodeKey)) {
          clone[nodeKey] = this.nodes[nodeKey].slice();
        }
      }

      return clone;
    }

    getObject(): {rootIds: string[];nodes: {[id: string]: string[]}}{
      return {
        rootIds: this.getRootIds(),
        nodes: this.getNodes(),
      };
    }

    toObject(): {rootIds: string[];nodes: {[id: string]: string[]}}{
      return this.getObject();
    }

    flatten(): Array<FlatTreeNode> {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;
      function countChildren(id: string): number {
        if (!_this.nodes[id]) {
          return 0;
        } else {
          const childrenCount = _this.nodes[id].length;
          return childrenCount;
        }
      }
    
      function traverse(startId: string, nodes: { [id: string]: Array<string> }, returnArray: Array<any>, level = 0): void {
        if (!startId || !nodes || !returnArray || !nodes[startId]) {
          return;
        }
    
        level++;
    
        const idsList = nodes[startId];
        for (let i = 0; i < idsList.length; i++) {
          const id = idsList[i];
          returnArray.push({ id, level, hasParent: true, });
          traverse(id, nodes, returnArray, level);
        }
    
        level--;
      }
      const extraPropsObject: Array<FlatTreeNode> = [];

      for (let i = 0; i < this.rootIds.length; i++) {
        const rootId = this.rootIds[i];
        extraPropsObject.push({
          id: rootId,
          level: 0,
          hasParent: false,
          childrenCount: 0,
        });

        traverse(rootId, this.nodes, extraPropsObject, 0);
      }

      for (const o of extraPropsObject) {
        o.childrenCount = countChildren(o.id);
      }

      return extraPropsObject;
    }

    moveIdBeforeId(moveId: string, beforeId: string): void {
      return this.moveId(moveId, beforeId, Direction.BEFORE);
    }

    moveIdAfterId(moveId: string, afterId: string): void {
      return this.moveId(moveId, afterId, Direction.AFTER);
    }

    moveIdIntoId(moveId: string, insideId: string, atStart = true): void {
      if (atStart) {
        return this.moveId(moveId, insideId, Direction.INSIDE_AT_START);
      } else {
        return this.moveId(moveId, insideId, Direction.INSIDE_AT_END);
      }
    }

    swapRootIdWithRootId(rootId: string, withRootId: string): void {
      const leftIndex = this.findRootId(rootId);
      const rightIndex = this.findRootId(withRootId);
      this.swapRootPositionWithRootPosition(leftIndex, rightIndex);
    }

    swapRootPositionWithRootPosition(swapRootPosition: number, withRootPosition: number): void {
      const temp = this.rootIds[withRootPosition];
      this.rootIds[withRootPosition] = this.rootIds[swapRootPosition];
      this.rootIds[swapRootPosition] = temp;
    }


    deleteId(id: string): void {
      this.rootDeleteId(id);
      this.nodeAndSubNodesDelete(id);
      this.nodeRefrencesDelete(id);
    }

    insertIdBeforeId(beforeId: string, insertId: string): void {
      const foundRootIdIndex = this.findRootId(beforeId);
      if (foundRootIdIndex > -1) {
        this.insertIdIntoRoot(insertId, foundRootIdIndex);
      }

      for (const nodeKey in this.nodes) {
        if (this.nodes.hasOwnProperty(nodeKey)) {
          const foundNodeIdIndex = this.findNodeId(nodeKey, beforeId);
          if (foundNodeIdIndex > -1) {
            this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex);
          }
        }
      }
    }

    insertIdAfterId(belowId: string, insertId: string): void {
      const foundRootIdIndex = this.findRootId(belowId);
      if (foundRootIdIndex > -1) {
        this.insertIdIntoRoot(insertId, foundRootIdIndex + 1);
      }

      for (const nodeKey in this.nodes) {
        if (this.nodes.hasOwnProperty(nodeKey)) {
          const foundNodeIdIndex = this.findNodeId(nodeKey, belowId);
          if (foundNodeIdIndex > -1) {
            this.insertIdIntoNode(nodeKey, insertId, foundNodeIdIndex + 1);
          }
        }
      }
    }

    insertIdIntoId(insideId: string, insertId: string): void {
      this.nodeInsertAtEnd(insideId, insertId);
      this.nodes[insertId] = [];
    }

    insertIdIntoRoot(id: string, position?: number): void {
      if (position === undefined) {
        this.rootInsertAtEnd(id);
      } else {
        if (position < 0) {
          const length = this.rootIds.length;
          this.rootIds.splice((position + length + 1), 0, id);
        } else {
          this.rootIds.splice(position, 0, id);
        }
      }

      this.nodes[id] = this.nodes[id] || [];
    }

    insertIdIntoNode(nodeKey: string, id: string, position?: number): void {
      this.nodes[nodeKey] = this.nodes[nodeKey] || [];
      this.nodes[id] = this.nodes[id] || [];
      if (position === undefined) {
        this.nodeInsertAtEnd(nodeKey, id);
      } else {
        if (position < 0) {
          const length = this.nodes[nodeKey].length;
          this.nodes[nodeKey].splice((position + length + 1), 0, id);
        } else {
          this.nodes[nodeKey].splice(position, 0, id);
        }
      }
    }

    private moveId(moveId: string, beforeId: string, direction: Direction): void {

      const sourceId = moveId;
      const sourceRootIndex = this.findRootId(sourceId);


      for (const nodeKey in this.nodes) {
        if (this.nodes.hasOwnProperty(nodeKey)) {
          break;
        }
      }

      // got all

      const targetId = beforeId;
      let targetRootIndex = this.findRootId(targetId);

      for (const nodeKey in this.nodes) {
        if (this.nodes.hasOwnProperty(nodeKey)) {
          break;
        }
      }

      // got all

      if (sourceRootIndex > -1) {
        if (targetRootIndex > -1) {
          // moving root to root
          // console.log(`Moving ROOT to ROOT`);
          // console.log(`RootIds:`);
          // console.log(this.rootIds);
          // console.log(`TargetIndex=${targetRootIndex}, SourceIndex=${sourceRootIndex}`);
          // console.log(`TargetId=${targetId}, SourceId=${sourceId}`);

          this.rootDelete(sourceRootIndex); // indexes change now

          if (targetRootIndex > sourceRootIndex) {
            targetRootIndex--;
          }

          switch (direction) {
            case Direction.BEFORE:
              this.insertIdIntoRoot(sourceId, targetRootIndex);
              break;
            case Direction.AFTER:
              this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
              break;
            case Direction.INSIDE_AT_START:
              this.nodeInsertAtStart(targetId, sourceId);
              break;
            case Direction.INSIDE_AT_END:
              this.nodeInsertAtEnd(targetId, sourceId);
              break;
          }
        } else {
          // moving root (source) ABOVE node (target)

          // will remove one entry from roots
          this.rootDelete(sourceRootIndex);

          for (const nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
              const index = this.findNodeId(nodeKey, targetId);
              if (index > -1) {
                switch (direction) {
                  case Direction.BEFORE:
                    this.insertIdIntoNode(nodeKey, sourceId, index);
                    break;
                  case Direction.AFTER:
                    this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                    break;
                  case Direction.INSIDE_AT_START:
                    this.nodeInsertAtStart(targetId, sourceId);
                    break;
                  case Direction.INSIDE_AT_END:
                    this.nodeInsertAtEnd(targetId, sourceId);
                    break;
                }
                break;
              }
            }
          }
        }
      } else {
        if (targetRootIndex > -1) {
          // moving node (source) ABOVE root (target)

          // delete source id from each node
          for (const nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
              const index = this.findNodeId(nodeKey, sourceId);
              if (index > -1) {
                // this.nodeInsertId(nodeKey, sourceId, index);
                this.nodeDeleteAtIndex(nodeKey, index);
                break;
              }
            }
          }

          switch (direction) {
            case Direction.BEFORE:
              this.insertIdIntoRoot(sourceId, targetRootIndex);
              break;
            case Direction.AFTER:
              this.insertIdIntoRoot(sourceId, targetRootIndex + 1);
              break;
            case Direction.INSIDE_AT_START:
              this.nodeInsertAtStart(targetId, sourceId);
              break;
            case Direction.INSIDE_AT_END:
              this.nodeInsertAtEnd(targetId, sourceId);
              break;
          }

        } else {
          // moving node (source) ABOVE node (target)

          // delete source id from each node
          for (const nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
              const index = this.findNodeId(nodeKey, sourceId);
              if (index > -1) {
                this.nodeDeleteAtIndex(nodeKey, index);
                break;
              }
            }
          }

          for (const nodeKey in this.nodes) {
            if (this.nodes.hasOwnProperty(nodeKey)) {
              const index = this.findNodeId(nodeKey, targetId);
              if (index > -1) {
                switch (direction) {
                  case Direction.BEFORE:
                    this.insertIdIntoNode(nodeKey, sourceId, index);
                    break;
                  case Direction.AFTER:
                    this.insertIdIntoNode(nodeKey, sourceId, index + 1);
                    break;
                  case Direction.INSIDE_AT_START:
                    this.nodeInsertAtStart(targetId, sourceId);
                    break;
                  case Direction.INSIDE_AT_END:
                    this.nodeInsertAtEnd(targetId, sourceId);
                    break;
                }
                break;
              }
            }
          }

        }
      }
    }


    private rootDeleteId(id: string): void {
      const index = this.findRootId(id);
      if (index > -1) {
        this.rootDelete(index);
      }
    }

    private nodeAndSubNodesDelete(nodeKey: string): void {
      const toDeleteLater: Array<string> = [];
      for (let i = 0; i < this.nodes[nodeKey].length; i++) {
        const id = this.nodes[nodeKey][i];
        this.nodeAndSubNodesDelete(id);
        toDeleteLater.push(nodeKey);
      }

      this.nodeDelete(nodeKey);
      for (let i = 0; i < toDeleteLater.length; i++) {
        this.nodeDelete(toDeleteLater[i]);
      }
    }

    private nodeRefrencesDelete(id: string): void {
      for (const nodeKey in this.nodes) {
        if (this.nodes.hasOwnProperty(nodeKey)) {
          for (let i = 0; i < this.nodes[nodeKey].length; i++) {
            const targetId = this.nodes[nodeKey][i];
            if (targetId === id) {
              this.nodeDeleteAtIndex(nodeKey, i);
            }
          }
        }
      }
    }

    private nodeDelete(nodeKey: string): void {
      delete this.nodes[nodeKey];
    }


    private findRootId(id: string): number {
      return this.rootIds.indexOf(id);
    }

    private findNodeId(nodeKey: string, id: string): number {
      return this.nodes[nodeKey].indexOf(id);
    }


    private nodeInsertAtStart(nodeKey: string, id: string): void {
      this.nodes[nodeKey].unshift(id);
    }

    private nodeInsertAtEnd(nodeKey: string, id: string): void {
      this.nodes[nodeKey].push(id);
    }

    private rootDelete(index: number): void {
      this.rootIds.splice(index, 1);
    }

    private nodeDeleteAtIndex(nodeKey: string, index: number): void {
      this.nodes[nodeKey].splice(index, 1);
    }


    private rootInsertAtEnd(id: string): void {
      this.rootIds.push(id);
    }
}
