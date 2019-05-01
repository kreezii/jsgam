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

function checkPath(coords,obstaclesPolys,walkPoly){
  let coordX=Math.round(coords.x);
  let coordY=Math.round(coords.y);
  let changePosition;
  let newPos;

  if(!PolyK.ContainsPoint(walkPoly,coordX,coordY))
  {
    changePosition=PolyK.ClosestEdge(walkPoly,coordX,coordY).point;
    newPos={x:Math.round(changePosition.x)+1,y:Math.round(changePosition.y)+1}
  }else if(obstaclesPolys!==undefined){
    for(let i=0;i<obstaclesPolys.length ;i++){
      if(PolyK.ContainsPoint(obstaclesPolys[i],coordX,coordY)){
        changePosition=PolyK.ClosestEdge(walkPoly,coordX,coordY).point;
        newPos={x:Math.round(changePosition.x)+1,y:Math.round(changePosition.y)+1}
        break;
      }
    }
  }

  return newPos;
}

export {boxesIntersect,checkPath,collision};
