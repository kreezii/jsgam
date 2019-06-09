import * as PolyK from 'polyk';

function boxesIntersect(a, b)
{
  var ab = a.getBounds();
  var bb = b.getBounds();
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function collision(a, b)
{
  let result;
  if(a!=undefined && b !=undefined){
    if(a.hitArea) result=PolyK.ContainsPoint(a.hitArea.points,b.x,b.y);
    else if(b.hitArea) result=PolyK.ContainsPoint(b.hitArea.points,a.x,a.y);
    else result=boxesIntersect(a,b);
  }

  return result;
}

function closestPoint(area,coords){
  let coordX=Math.round(coords.x);
  let coordY=Math.round(coords.y);
  let changePosition={};
  let closestedge=PolyK.ClosestEdge(area,coordX,coordY);
  changePosition.x=closestedge.point.x-closestedge.norm.x;
  changePosition.y=closestedge.point.y-closestedge.norm.y;
  return {x:Math.round(changePosition.x),y:Math.round(changePosition.y)}
}

function checkPath(coords,obstaclesPolys,walkPoly){
  let coordX=Math.round(coords.x);
  let coordY=Math.round(coords.y);
  let changePosition={};
  let newPos;

  if(!PolyK.ContainsPoint(walkPoly,coordX,coordY))
  {
    let closestedge=PolyK.ClosestEdge(walkPoly,coordX,coordY);
    changePosition.x=closestedge.point.x-closestedge.norm.x;
    changePosition.y=closestedge.point.y-closestedge.norm.y;
    newPos={x:Math.round(changePosition.x),y:Math.round(changePosition.y)}
  }else if(obstaclesPolys!==undefined){

    for(let i=0;i<obstaclesPolys.length ;i++){
      if(PolyK.ContainsPoint(obstaclesPolys[i],coordX,coordY)){
        let closestedge=PolyK.ClosestEdge(walkPoly,coordX,coordY);
        changePosition.x=closestedge.point.x-closestedge.norm.x;
        changePosition.y=closestedge.point.y-closestedge.norm.y;
        newPos={x:Math.round(changePosition.x)+1,y:Math.round(changePosition.y)+1};
        break;
      }
    }
  }

  return newPos;
}

export {boxesIntersect,checkPath,collision,closestPoint};
