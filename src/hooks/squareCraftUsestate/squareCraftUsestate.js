 export function squareCraftUsestate(initialValue) {
    let state = initialValue;
  
    function setState(newValue) {
        state = newValue;
        renderDropdown(state); 
    }
  
    return [() => state, setState];
}
