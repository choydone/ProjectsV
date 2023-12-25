import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";

export class Tree {
    /**
     * 树节点点击,获取节点包括所有子节点的ID集合
     */
    private _tplClickNodeIdLs: Array<any> = [];

    /** *************************************************************
     *  树结构常用方法集合
     * *************************************************************/
    /**
     * 菜单树点击事件
     * @param event
     */
    tplTreeEvent(event: NzFormatEmitEvent): void {
        // 表示点击事件
        if (event.eventName == 'click' && event.node instanceof NzTreeNode) {
            this.clickTplTreeEvent(event.node);
        }
    }

    /**
     * 节点点击事件，用来重写方法
     */
    clickTplTreeEvent = (node: NzTreeNode) => {
    };

    // clickTplTreeEvent(node: NzTreeNode): void {
    // }

    /**
     * 树节点的默认展示
     */
    tplExpandedTreeNode(nodes: Array<any>): void {
        if (nodes.length == 0) {
            return;
        }
        nodes[0].expanded = true;
        if (nodes[0].children.length > 0) {
            this.tplExpandedTreeNode(nodes[0].children);
            return;
        }
    }

    /**
     * 根据节点获取节点下的所有ID集合
     */
    tplTreeNodeIdLs(node: NzTreeNode): Array<any> {
        this._tplClickNodeIdLs = []
        this._tplTreeNodeIdLs(node);
        return this._tplClickNodeIdLs;
    }

    private _tplTreeNodeIdLs(node: NzTreeNode): void {

        this._tplClickNodeIdLs = [...this._tplClickNodeIdLs, node.origin['id']];
        if (node.children.length > 0) {
            // @ts-ignore
            node.children.forEach((n) => {
                this._tplTreeNodeIdLs(n);
            })
        }
    }

}