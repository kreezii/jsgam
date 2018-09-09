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

    if(b.hitArea) result=PolyK.ContainsPoint(b.hitArea.points,a.x,a.y);
    else result=boxesIntersect(a,b);
  }
  return result;
}

function checkPath(newpos,obstaclesPolys,walkPoly){
  let changePosition;
  let newPos;

  if(!PolyK.ContainsPoint(walkPoly,newpos.x,newpos.y))
  {
    changePosition=PolyK.ClosestEdge(walkPoly,newpos.x,newpos.y).point;
    newPos={x:Math.round(changePosition.x)+1,y:Math.round(changePosition.y)+1}
  }else if(obstaclesPolys!=undefined){
    for(let i=0;i<obstaclesPolys.length ;i++){
      if(PolyK.ContainsPoint(obstaclesPolys[i],newpos.x,newpos.y)){
        changePosition=PolyK.ClosestEdge(walkPoly,newpos.x,newpos.y).point;
        newPos={x:Math.round(changePosition.x)+1,y:Math.round(changePosition.y)+1}
        break;
      }
    }
  }
  return newPos;
}

export {boxesIntersect,checkPath,collision};
