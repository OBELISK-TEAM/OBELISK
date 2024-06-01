import React from 'react';
import { Command, CommandList, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { MenuGroup, DropDownMenuItem, MenuItem } from '../interfaces/canva-interfaces';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface CommandMenuProps {
  menuList: MenuGroup[];
  dropDownMenu: { [key: string]: DropDownMenuItem[] };
}

const CommandMenu: React.FC<CommandMenuProps> = ({ menuList, dropDownMenu }) => {

  const renderDropdownMenu = (dropDownKey: string | null, option: MenuItem) => {
    if (!dropDownKey) {
      return (
        <CommandItem key={option.name} className="flex gap-2 cursor-pointer text-gray-700 hover:text-gray-800" onSelect={option.action}>
          {option.icon}
          {option.text}
        </CommandItem>
      );
    }

    const menuItems = dropDownMenu[dropDownKey] || [];
    return (
      <DropdownMenu key={option.name}>
        <DropdownMenuTrigger asChild>
          <CommandItem className="flex gap-2 cursor-pointer text-gray-700 hover:text-gray-800">
            {option.icon}
            {option.text}
          </CommandItem>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-100 shadow-lg rounded-md p-4 custom-scrollbar">
          <DropdownMenuLabel className="text-gray-800 font-semibold">Properties</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2 border-t border-gray-300" />
          {menuItems.map((item, itemKey) => (
            <DropdownMenuItem key={itemKey} onSelect={(event) => event.preventDefault()} className="p-2 hover:bg-gray-300 rounded text-gray-800">
              <label className="flex items-center mr-4 text-gray-800">
                <div className="text-gray-800 font-semibold">
                  {item.text}
                </div>

                {item.inputType === 'file' ? (
                  <div className="relative w-full">
                    <Input
                      type="file"
                      onChange={item.action}
                      className="opacity-0 absolute inset-0 z-50 cursor-pointer w-full"
                    />
                    <div className="flex items-center justify-center p-1 border border-gray-400 rounded bg-gray-700 text-white cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      Choose File
                    </div>
                  </div>
                ) : (
                  <Input
                    type={item.inputType}
                    value={item.inputValue}
                    onChange={item.action}
                    autoFocus={item.inputType === 'text'}
                    className="ml-2 p-1 border border-gray-400 rounded bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 min-w-16"
                  />
                )}
              </label>
            </DropdownMenuItem>
          ))}

          {!(option.dropDownKey === 'addImageFromDisk' || option.dropDownKey === 'loadImagesFromJson') && (
            <DropdownMenuItem className="p-2 hover:bg-gray-300 rounded text-gray-800">
              <button onClick={option.action} className="ml-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
                {option.text}
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <Command style={{ overflow: 'visible' }}>
      <CommandList style={{ overflow: 'visible' }} className="custom-scrollbar">
        {menuList.map((menu, key) => (
          <CommandGroup key={key} heading={menu.group}>
            {menu.items.map((option, optionKey) => (
              renderDropdownMenu(option.dropDownKey, option)
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
      </CommandList>
    </Command>
  );
};

export default CommandMenu;
