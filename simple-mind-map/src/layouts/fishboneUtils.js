import { degToRad } from '../utils/'

export default {
  top: {
    renderExpandBtn({
      node,
      btn,
      expandBtnSize,
      translateX,
      translateY,
      width,
      height
    }) {
      if (node.parent && node.parent.isRoot) {
        btn.translate(
          width * 0.3 - expandBtnSize / 2 - translateX,
          -expandBtnSize / 2 - translateY
        )
      } else {
        btn.translate(
          width * 0.3 - expandBtnSize / 2 - translateX,
          height + expandBtnSize / 2 - translateY
        )
      }
    },
    renderLine({
      node,
      line,
      top,
      x,
      lineLength,
      height,
      expandBtnSize,
      maxy
    }) {
      if (node.parent && node.parent.isRoot) {
        line.plot(
          `M ${x},${top} L ${x + lineLength},${
            top - Math.tan(degToRad(45)) * lineLength
          }`
        )
      } else {
        line.plot(`M ${x},${top + height + expandBtnSize} L ${x},${maxy}`)
      }
    },
    computedLeftTopValue({ layerIndex, node, ctx, marginY }) {
      if (layerIndex >= 1 && node.children) {
        // 遍历三级及以下节点的子节点
        let startLeft = node.left + node.width * 0.5
        let totalTop =
          node.top +
          node.height +
          marginY +
          (ctx.getNodeActChildrenLength(node) > 0 ? node.expandBtnSize : 0)
        node.children.forEach(item => {
          item.left = startLeft
          item.top += totalTop
          totalTop +=
            item.height +
            marginY +
            (ctx.getNodeActChildrenLength(item) > 0 ? item.expandBtnSize : 0)
        })
      }
    },
    adjustLeftTopValueBefore({ node, parent, ctx, marginY }) {
      // 调整top
      let len = node.children.length
      // 调整三级及以下节点的top
      if (parent && !parent.isRoot && len > 0) {
        let totalHeight = node.children.reduce((h, item) => {
          return (
            h +
            item.height +
            (ctx.getNodeActChildrenLength(item) > 0 ? item.expandBtnSize : 0)
          )
        }, 0) + len * marginY
        ctx.updateBrothersTop(node, totalHeight)
      }
    },
    adjustLeftTopValueAfter({ parent, node, ctx, marginY }) {
      // 将二级节点的子节点移到上方
      if (parent && parent.isRoot) {
        // 遍历二级节点的子节点
        let totalHeight = 0
        node.children.forEach(item => {
          // 调整top
          let nodeTotalHeight = ctx.getNodeAreaHeight(item)
          let _top = item.top
          item.top =
            node.top - (item.top - node.top) - nodeTotalHeight + node.height + marginY
          // 调整left
          let offsetLeft =
            (nodeTotalHeight + totalHeight) / Math.tan(degToRad(45))
          item.left += offsetLeft
          totalHeight += nodeTotalHeight
          // 同步更新后代节点
          ctx.updateChildrenPro(item.children, {
            top: item.top - _top,
            left: offsetLeft
          })
        })
      }
    }
  },
  bottom: {
    renderExpandBtn({
      node,
      btn,
      expandBtnSize,
      translateX,
      translateY,
      width,
      height
    }) {
      if (node.parent && node.parent.isRoot) {
        btn.translate(
          width * 0.3 - expandBtnSize / 2 - translateX,
          height + expandBtnSize / 2 - translateY
        )
      } else {
        btn.translate(
          width * 0.3 - expandBtnSize / 2 - translateX,
          -expandBtnSize / 2 - translateY
        )
      }
    },
    renderLine({ node, line, top, x, lineLength, height, miny }) {
      if (node.parent && node.parent.isRoot) {
        line.plot(
          `M ${x},${top + height} L ${x + lineLength},${
            top + height + Math.tan(degToRad(45)) * lineLength
          }`
        )
      } else {
        line.plot(`M ${x},${top} L ${x},${miny}`)
      }
    },
    computedLeftTopValue({ layerIndex, node, ctx, marginY }) {
      if (layerIndex === 1 && node.children) {
        // 遍历二级节点的子节点
        let startLeft = node.left + node.width * 0.5
        let totalTop =
          node.top +
          node.height +
          marginY +
          (ctx.getNodeActChildrenLength(node) > 0 ? node.expandBtnSize : 0)

        node.children.forEach(item => {
          item.left = startLeft
          item.top =
            totalTop +
            (ctx.getNodeActChildrenLength(item) > 0 ? item.expandBtnSize : 0)
          totalTop +=
            item.height +
            marginY +
            (ctx.getNodeActChildrenLength(item) > 0 ? item.expandBtnSize : 0)
        })
      }
      if (layerIndex > 1 && node.children) {
        // 遍历三级及以下节点的子节点
        let startLeft = node.left + node.width * 0.5
        let totalTop =
          node.top -
          marginY -
          (ctx.getNodeActChildrenLength(node) > 0 ? node.expandBtnSize : 0)
        node.children.forEach(item => {
          item.left = startLeft
          item.top = totalTop - item.height
          totalTop -=
            item.height +
            marginY +
            (ctx.getNodeActChildrenLength(item) > 0 ? item.expandBtnSize : 0)
        })
      }
    },
    adjustLeftTopValueBefore({ node, ctx, layerIndex, marginY }) {
      // 调整top
      let len = node.children.length
      if (layerIndex > 2 && len > 0) {
        let totalHeight = node.children.reduce((h, item) => {
          return (
            h +
            item.height +
            (ctx.getNodeActChildrenLength(item) > 0 ? item.expandBtnSize : 0)
          )
        }, 0) + 
        len * marginY
        ctx.updateBrothersTop(node, -totalHeight)
      }
    },
    adjustLeftTopValueAfter({ parent, node, ctx, marginY }) {
      // 将二级节点的子节点移到上方
      if (parent && parent.isRoot) {
        // 遍历二级节点的子节点
        let totalHeight = 0
        let totalHeight2 = 0
        node.children.forEach(item => {
          // 调整top
          let hasChildren = ctx.getNodeActChildrenLength(item) > 0
          let nodeTotalHeight = ctx.getNodeAreaHeight(item)
          let offset =
            hasChildren > 0
              ? nodeTotalHeight -
                item.height -
                (hasChildren ? item.expandBtnSize : 0)
              : 0
          let _top = totalHeight + offset
          item.top += _top - marginY
          // 调整left
          let offsetLeft =
            (totalHeight2 + nodeTotalHeight) / Math.tan(degToRad(45))
          item.left += offsetLeft
          totalHeight += offset
          totalHeight2 += nodeTotalHeight
          // 同步更新后代节点
          ctx.updateChildrenPro(item.children, {
            top: _top,
            left: offsetLeft
          })
        })
      }
    }
  }
}
